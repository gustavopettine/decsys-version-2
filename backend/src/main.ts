import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { EnvService } from './env/env.service'
import * as bodyParser from 'body-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const envService = app.get(EnvService)
  const port = envService.get('PORT')
  const isProduction = envService.get('NODE_ENV') === 'production'

  const frontendUrl = isProduction
    ? envService.get('FRONTEND_URL_DEPLOY')
    : envService.get('FRONTEND_URL')

  app.enableCors({
    origin: [frontendUrl],
    methods: ['GET', 'POST'],
    credentials: true,
  })

  app.use(bodyParser.json({ limit: '10mb' }))
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

  await app.listen(port)
}

bootstrap()
