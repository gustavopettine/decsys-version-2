import { Module } from '@nestjs/common'
import { AuthController } from './controllers/auth.controller'
import { SearchController } from './controllers/search.controller'
import { RegisterController } from './controllers/register.controller'
import { ValidationController } from './controllers/validation.controller'
import { ValidateTokenController } from './controllers/validate-token.controller'
import { ResultController } from './controllers/result.controller'
import { AuthService } from './services/auth.service'
import { ValidationService } from './services/validation.service'
import { BlockchainService } from './services/blockchain.service'
import { BlockchainResultService } from './services/blockchain-result.service'
import { DatabaseModule } from '../database/database.module'
import { EnvModule } from '../env/env.module'

@Module({
  imports: [EnvModule, DatabaseModule],
  controllers: [
    RegisterController,
    AuthController,
    ValidateTokenController,
    SearchController,
    ValidationController,
    ResultController,
  ],
  providers: [
    AuthService,
    ValidationService,
    BlockchainService,
    BlockchainResultService,
  ],
})
export class HTTPModule {}
