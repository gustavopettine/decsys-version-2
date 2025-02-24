import {
  Controller,
  Post,
  Body,
  HttpCode,
  UsePipes,
  HttpException,
  UseFilters,
} from '@nestjs/common'
import { PrismaService } from '../../database/prisma/prisma.service'
import { ValidationService } from '../services/validation.service'
import { BlockchainService } from '../services/blockchain.service'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { DatavalidExceptionFilter } from '../filters/datavalid-exception.filter'
// import { boolean, z } from 'zod'
import { z } from 'zod'

const validationUserSchema = z.object({
  cpf: z.string().length(11).regex(/^\d+$/),
  validacao: z.object({
    biometria_facial: z.object({
      base64: z.string().min(1),
    }),
  }),
  walletAddress: z.string().startsWith('0x').length(42),
})

type ValidationUserSchema = z.infer<typeof validationUserSchema>

@Controller('/validation')
@UseFilters(DatavalidExceptionFilter)
export class ValidationController {
  constructor(
    private prisma: PrismaService,
    private validationService: ValidationService,
    private blockchainService: BlockchainService,
  ) {}

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(validationUserSchema))
  async validateKYC(@Body() body: ValidationUserSchema) {
    const {
      cpf,
      validacao: {
        biometria_facial: { base64 },
      },
      walletAddress,
    } = body

    const user = await this.prisma.user.findUnique({
      where: { walletAddress },
    })

    if (!user) {
      throw new HttpException('User not found', 404)
    }

    const biometryResult = await this.validationService.validateSERPRO(
      cpf,
      base64,
    )

    await this.blockchainService.sendKYCValidationToBlockchain(
      walletAddress,
      biometryResult.isReal ? 'VALIDATED' : 'PENDING',
      cpf,
      base64,
      biometryResult.isReal,
      biometryResult.probability,
      biometryResult.similarity.toString(),
      new Date().toISOString(),
    )

    await this.prisma.user.update({
      where: { walletAddress },
      data: {
        status: biometryResult.isReal ? 'VALIDATED' : 'PENDING',
      },
    })

    return {
      walletAddress,
      cpf,
      base64,
      biometryResult,
    }
  }
}
