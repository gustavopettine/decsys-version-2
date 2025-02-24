import { Controller, Post, Headers, UsePipes } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Public } from '../../auth/public'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { z } from 'zod'

const validateTokenSchema = z.object({
  authorization: z.string().startsWith('Bearer '),
})

type ValidateTokenSchema = z.infer<typeof validateTokenSchema>

@Controller('/validate-token')
export class ValidateTokenController {
  constructor(private jwtService: JwtService) {}

  @Public()
  @Post()
  @UsePipes(new ZodValidationPipe(validateTokenSchema))
  async validate(@Headers() headers: ValidateTokenSchema) {
    try {
      const token = headers.authorization.split(' ')[1]
      await this.jwtService.verifyAsync(token)

      return { isValid: true }
    } catch {
      return { isValid: false }
    }
  }
}
