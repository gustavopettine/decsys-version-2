import { Injectable } from '@nestjs/common'
import { EnvService } from 'src/env/env.service'
import { ethers } from 'ethers'
import * as crypto from 'crypto'
import axios from 'axios'
import * as FormData from 'form-data'

@Injectable()
export class BlockchainService {
  private provider: ethers.Provider
  private contract: ethers.Contract
  private wallet: ethers.Wallet
  private encryptionKey: string
  private pinataUrl: string
  private pinataApiKey: string
  private pinataApiSecret: string

  constructor(private env: EnvService) {
    this.provider = new ethers.JsonRpcProvider(this.env.get('XDC_RPC_URL'))
    this.wallet = new ethers.Wallet(this.env.get('PRIVATE_KEY'), this.provider)
    this.encryptionKey = this.env.get('ENCRYPTION_KEY')

    this.pinataUrl = this.env.get('PINATA_URL')
    this.pinataApiKey = this.env.get('PINATA_API_KEY')
    this.pinataApiSecret = this.env.get('PINATA_API_SECRET')

    const contractABI = [
      'function createKYC(string walletAddress, string status, string cpf, string base64Image, bool vivacity, string probability, string similarity, string validationTime)',
    ]

    this.contract = new ethers.Contract(
      this.env.get('KYC_CONTRACT_ADDRESS'),
      contractABI,
      this.wallet,
    )
  }

  private encryptData(data: string): string {
    try {
      const key = crypto
        .createHash('sha256')
        .update(this.encryptionKey)
        .digest()
      const iv = crypto.randomBytes(16)

      const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
      let encrypted = cipher.update(data, 'utf8', 'hex')
      encrypted += cipher.final('hex')

      return `${iv.toString('hex')}:${encrypted}`
    } catch (error) {
      throw new Error(`Erro ao encriptar dados: ${error.message}`)
    }
  }

  private async uploadToPinata(base64Image: string): Promise<string> {
    try {
      const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '')
      const buffer = Buffer.from(base64Data, 'base64')

      const form = new FormData()
      form.append('file', buffer, {
        filename: `image-${Date.now()}.jpg`,
        contentType: 'image/jpeg',
      })

      const response = await axios.post(this.pinataUrl, form, {
        headers: {
          ...form.getHeaders(),
          pinata_api_key: this.pinataApiKey,
          pinata_secret_api_key: this.pinataApiSecret,
        },
      })

      return response.data.IpfsHash
    } catch (error) {
      throw new Error(`Erro ao fazer upload para Pinata: ${error.message}`)
    }
  }

  async sendKYCValidationToBlockchain(
    walletAddress: string,
    status: string,
    cpf: string,
    base64Image: string,
    vivacity: boolean,
    probability: string,
    similarity: string,
    validationTime: string,
  ): Promise<ethers.ContractTransaction> {
    try {
      const ipfsHash = await this.uploadToPinata(base64Image)

      const encryptedIpfsHash = this.encryptData(ipfsHash)
      const encryptedCPF = this.encryptData(cpf)
      const encryptedProbability = this.encryptData(probability)
      const encryptedSimilarity = this.encryptData(similarity)
      const encryptedValidationTime = this.encryptData(validationTime)

      const transaction = await this.contract.createKYC(
        walletAddress,
        status,
        encryptedCPF,
        encryptedIpfsHash,
        vivacity,
        encryptedProbability,
        encryptedSimilarity,
        encryptedValidationTime,
      )

      return transaction
    } catch (error) {
      throw new Error(
        `Falha ao enviar validação KYC para blockchain: ${error.message}`,
      )
    }
  }
}
