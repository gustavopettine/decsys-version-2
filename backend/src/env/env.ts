import { z } from 'zod'

export const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string().url(),

  SERPRO_API_URL: z.string().url(),
  CONSUMER_KEY: z.string().min(1),
  CONSUMER_SECRET: z.string().min(1),

  XDC_RPC_URL: z.string().url(),
  KYC_CONTRACT_ADDRESS: z.string().min(1),
  PRIVATE_KEY: z.string().min(1),

  JWT_PRIVATE_KEY: z.string().min(1),
  JWT_PUBLIC_KEY: z.string().min(1),

  ENCRYPTION_KEY: z.string().min(1),

  PINATA_URL: z.string().url(),
  PINATA_API_KEY: z.string().min(1),
  PINATA_API_SECRET: z.string().min(1),
  PINATA_GATEWAY_URL: z.string().url(),

  NODE_ENV: z.enum(['development', 'production']).default('development'),

  FRONTEND_URL: z.string().url().default('http://localhost:3000'),
  FRONTEND_URL_DEPLOY: z.string().url().default('https://decsys.pages.dev'),
})

export type Env = z.infer<typeof envSchema>
