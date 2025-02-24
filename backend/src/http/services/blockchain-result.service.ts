import { Injectable } from '@nestjs/common'
import { EnvService } from 'src/env/env.service'
import { ethers } from 'ethers'
import * as crypto from 'crypto'
import axios from 'axios'

@Injectable()
export class BlockchainResultService {
  private provider: ethers.Provider
  private contract: ethers.Contract
  private encryptionKey: string
  private pinataGatewayUrl: string

  constructor(private env: EnvService) {
    this.provider = new ethers.JsonRpcProvider(this.env.get('XDC_RPC_URL'))
    this.encryptionKey = this.env.get('ENCRYPTION_KEY')
    this.pinataGatewayUrl = this.env.get('PINATA_GATEWAY_URL')

    const contractABI = [
      'function getKYC(string walletAddress) public view returns (string, string, string, string, bool, string, string, string)',
    ]

    this.contract = new ethers.Contract(
      this.env.get('KYC_CONTRACT_ADDRESS'),
      contractABI,
      this.provider,
    )
  }

  private decryptData(encryptedData: string): string {
    try {
      if (!encryptedData || encryptedData.trim() === '') {
        throw new Error('Dados encriptados vazios ou inexistentes')
      }

      if (!encryptedData.includes(':')) {
        throw new Error(
          'Formato inválido dos dados encriptados (faltando separador)',
        )
      }

      const [ivHex, encryptedText] = encryptedData.split(':')

      if (ivHex.length !== 32) {
        throw new Error(`IV inválido: tamanho ${ivHex.length}, esperado 32`)
      }

      const iv = Buffer.from(ivHex, 'hex')

      const key = crypto
        .createHash('sha256')
        .update(this.encryptionKey)
        .digest()

      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
      let decrypted = decipher.update(encryptedText, 'hex', 'utf8')
      decrypted += decipher.final('utf8')
      return decrypted
    } catch (error) {
      throw new Error(`Erro ao decriptar dados: ${error.message}`)
    }
  }

  private async getImageFromIPFS(ipfsHash: string): Promise<string> {
    try {
      const url = `${this.pinataGatewayUrl}/${ipfsHash}`

      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 30000,
      })

      const base64Image = Buffer.from(response.data, 'binary').toString(
        'base64',
      )
      return `data:image/jpeg;base64,${base64Image}`
    } catch (error) {
      throw new Error(`Falha ao recuperar imagem do IPFS: ${error.message}`)
    }
  }

  async getKYCFromBlockchain(walletAddress: string) {
    try {
      const blockchainData = await this.contract.getKYC(walletAddress)

      const [
        addressFromChain,
        status,
        encryptedCPF,
        encryptedIPFSHash,
        vivacity,
        encryptedProbability,
        encryptedSimilarity,
        encryptedValidationTime,
      ] = blockchainData

      if (status !== 'VALIDATED' && status !== 'PENDING') {
        return {
          walletAddress: addressFromChain,
          status,
          cpf: '',
          base64Image: '',
          vivacity: false,
          probability: '',
          similarity: '',
          validationTime: '',
          message: 'Usuário não completou a validação KYC',
        }
      }

      if (!encryptedIPFSHash || encryptedIPFSHash === '') {
        throw new Error('Hash IPFS encriptado não disponível')
      }

      const ipfsHash = this.decryptData(encryptedIPFSHash)

      const base64Image = await this.getImageFromIPFS(ipfsHash)

      const decryptedData = {
        walletAddress: addressFromChain,
        status,
        cpf: this.decryptData(encryptedCPF),
        base64Image,
        vivacity,
        probability: this.decryptData(encryptedProbability),
        similarity: this.decryptData(encryptedSimilarity),
        validationTime: this.decryptData(encryptedValidationTime),
      }

      return decryptedData
    } catch (error) {
      throw new Error(
        `Falha ao buscar dados KYC da blockchain: ${error.message}`,
      )
    }
  }
}
