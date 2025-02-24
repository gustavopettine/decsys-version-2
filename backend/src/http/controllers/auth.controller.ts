import {
  Controller,
  Post,
  Body,
  HttpCode,
  UsePipes,
  BadRequestException,
} from '@nestjs/common'
import { PrismaService } from '../../database/prisma/prisma.service'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { z } from 'zod'
import { JwtService } from '@nestjs/jwt'
import { ethers } from 'ethers'
import { Public } from '../../auth/public'
import { generateNonce } from 'src/utils/nonce'

const authUserSchema = z.object({
  walletAddress: z.string().startsWith('0x').length(42),
  signature: z.string(),
})

const nonceUserSchema = z.object({
  walletAddress: z.string().startsWith('0x').length(42),
})

type AuthUserSchema = z.infer<typeof authUserSchema>
type NonceUserSchema = z.infer<typeof nonceUserSchema>

@Controller('/auth')
export class AuthController {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  @Public()
  @Post('nonce')
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(nonceUserSchema))
  async getNonce(@Body() body: NonceUserSchema) {
    const { walletAddress } = body

    const user = await this.prisma.user.findUnique({
      where: { walletAddress },
    })

    if (!user) {
      throw new BadRequestException('User not registered.')
    }

    return { nonce: user.nonce }
  }

  @Public()
  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(authUserSchema))
  async login(@Body() body: AuthUserSchema) {
    const { walletAddress, signature } = body

    const user = await this.prisma.user.findUnique({
      where: { walletAddress },
    })

    if (!user) {
      throw new BadRequestException('User not registered.')
    }

    const message = `Login with nonce: ${user.nonce}`
    const recoveredAddress = ethers.verifyMessage(message, signature)

    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      throw new BadRequestException('Invalid signature.')
    }

    const token = await this.jwtService.signAsync({ sub: user.id })
    const newNonce = generateNonce()

    await this.prisma.user.update({
      where: { id: user.id },
      data: { nonce: newNonce },
    })

    return { token }
  }
}
