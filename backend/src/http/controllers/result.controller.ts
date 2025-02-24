import { Controller, Get, Param, HttpCode, UsePipes } from '@nestjs/common'
import { BlockchainResultService } from '../services/blockchain-result.service'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { z } from 'zod'
import * as sharp from 'sharp'

const resultUserSchema = z.object({
  walletAddress: z.string().startsWith('0x').length(42),
})

type ResultUserSchema = z.infer<typeof resultUserSchema>

@Controller('/result/:walletAddress')
export class ResultController {
  constructor(private blockchainResultService: BlockchainResultService) {}

  private async compressImage(base64String: string): Promise<string> {
    try {
      const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '')
      const imageBuffer = Buffer.from(base64Data, 'base64')

      const compressedImageBuffer = await sharp(imageBuffer)
        .jpeg({ quality: 100 })
        .resize(400, null, {
          withoutEnlargement: true,
          fit: 'inside',
        })
        .toBuffer()

      return `data:image/jpeg;base64,${compressedImageBuffer.toString('base64')}`
    } catch (error) {
      console.error('Erro ao comprimir imagem:', error)
      return base64String
    }
  }

  @Get()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(resultUserSchema))
  async getBlockchainResult(@Param() param: ResultUserSchema) {
    const { walletAddress } = param

    const blockchainData =
      await this.blockchainResultService.getKYCFromBlockchain(walletAddress)

    if (!blockchainData || blockchainData.status !== 'VALIDATED') {
      return null
    }

    const compressedImage = await this.compressImage(blockchainData.base64Image)

    return {
      cpf: blockchainData.cpf,
      base64Image: compressedImage,
      biometryResult: {
        vivacity: blockchainData.vivacity,
        probability: blockchainData.probability,
        similarity: blockchainData.similarity,
      },
    }
  }
}
