import { Injectable } from '@nestjs/common'
import { EnvService } from '../../env/env.service'
import axios from 'axios'

@Injectable()
export class AuthService {
  constructor(private env: EnvService) {}

  async getSerproToken() {
    const credentials = `${this.env.get('CONSUMER_KEY')}:${this.env.get('CONSUMER_SECRET')}`
    const base64Credentials = Buffer.from(credentials).toString('base64')

    try {
      const response = await axios.post(
        `${this.env.get('SERPRO_API_URL')}/token`,
        'grant_type=client_credentials',
        {
          headers: {
            Authorization: `Basic ${base64Credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )

      return response.data.access_token
    } catch (error) {
      throw new Error('SERPRO token failed')
    }
  }
}
