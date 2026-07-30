export function stripAccents(value: string) {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '')
}
