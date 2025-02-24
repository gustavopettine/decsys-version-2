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
import { Public } from '../../auth/public'
import { generateNonce } from 'src/utils/nonce'

const registerUserSchema = z.object({
  walletAddress: z.string().startsWith('0x').length(42),
})

type RegisterUserSchema = z.infer<typeof registerUserSchema>

@Controller('/register')
export class RegisterController {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  @Public()
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(registerUserSchema))
  async register(@Body() body: RegisterUserSchema) {
    const { walletAddress } = body

    const existingUser = await this.prisma.user.findUnique({
      where: { walletAddress },
    })

    if (existingUser) {
      throw new BadRequestException('User already registered.')
    }

    const nonce = generateNonce()

    const newUser = await this.prisma.user.create({
      data: {
        walletAddress,
        nonce,
        status: 'PENDING',
      },
    })

    const token = await this.jwtService.signAsync({ sub: newUser.id })

    return { token, nonce }
  }
}
