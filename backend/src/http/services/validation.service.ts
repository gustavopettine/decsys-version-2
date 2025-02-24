import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { EnvService } from '../../env/env.service'
import { AuthService } from './auth.service'
import axios, { AxiosError } from 'axios'
import { getDatavalidError } from '../../utils/datavalidErrors'

@Injectable()
export class ValidationService {
  constructor(
    private env: EnvService,
    private authService: AuthService,
  ) {}

  async validateSERPRO(cpf: string, base64Image: string) {
    try {
      const token = await this.authService.getSerproToken()

      const response = await axios.post(
        `${this.env.get('SERPRO_API_URL')}/datavalid/v4/pf-facial`,
        {
          cpf,
          validacao: {
            biometria_facial: {
              formato: 'JPG',
              vivacidade: true,
              base64: base64Image,
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const biometryResult = {
        isReal: response.data.biometria_facial.vivacidade === 'REAL',
        probability: response.data.biometria_facial.probabilidade,
        similarity: response.data.biometria_facial.similaridade,
      }

      return biometryResult
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const { status, data } = error.response

        if (status === 400 && data === 'cpf : valor inválido') {
          error.response.status = 422
          error.response.data = {
            code: 'DV010',
            detail: getDatavalidError('DV010'),
          }
          throw error
        }

        if (status === 422) {
          throw error
        }

        if (status === 401) {
          throw new HttpException(
            'Authentication failed',
            HttpStatus.UNAUTHORIZED,
          )
        }
      }

      throw new HttpException(
        'Biometric validation failed',
        HttpStatus.BAD_REQUEST,
      )
    }
  }
}
