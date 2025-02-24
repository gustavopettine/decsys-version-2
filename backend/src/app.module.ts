import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { HTTPModule } from './http/http.module'
import { EnvModule } from './env/env.module'
import { AuthModule } from './auth/auth.module'
import { envSchema } from './env/env'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    HTTPModule,
    EnvModule,
    AuthModule,
  ],
})
export class AppModule {}
