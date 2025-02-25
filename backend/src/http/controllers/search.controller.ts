import {
  Controller,
  Get,
  Param,
  HttpCode,
  HttpException,
  UsePipes,
} from '@nestjs/common'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { z } from 'zod'
import { BlockchainResultService } from '../services/blockchain-result.service'
import { PrismaService } from 'src/database/prisma/prisma.service'

const searchUserSchema = z.object({
  walletAddress: z.string().startsWith('0x').length(42),
})

type SearchUserSchema = z.infer<typeof searchUserSchema>

@Controller('/user/:walletAddress')
export class SearchController {
  constructor(
    private blockchainResultService: BlockchainResultService,
    private prismaService: PrismaService,
  ) {}

  @Get()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(searchUserSchema))
  async searchUser(@Param() param: SearchUserSchema) {
    const { walletAddress } = param

    const blockchainData =
      await this.blockchainResultService.getKYCFromBlockchain(walletAddress)

    if (!blockchainData || !blockchainData.walletAddress) {
      const userInDatabase = await this.prismaService.user.findUnique({
        where: {
          walletAddress,
        },
      })

      if (userInDatabase) {
        return {
          walletAddress,
          status: 'PENDING',
        }
      }

      throw new HttpException('User not found', 404)
    }

    return {
      walletAddress: blockchainData.walletAddress,
      status: blockchainData.status,
    }
  }
}
