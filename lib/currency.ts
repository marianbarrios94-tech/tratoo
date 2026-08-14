export function formatPrice(amount: number | string, currency: string) {
  if (currency === 'usd') {
    return `USD ${Number(amount).toFixed(2)}`
  }
  return `$${Number(amount).toLocaleString('es-AR', { maximumFractionDigits: 0 })}`
}
