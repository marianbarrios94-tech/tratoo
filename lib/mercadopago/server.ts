import { MercadoPagoConfig } from 'mercadopago'

export function createMercadoPagoClient() {
  return new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! })
}
