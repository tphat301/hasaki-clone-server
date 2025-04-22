type NumberEnumType = {
  [key: string]: string | number
}
type StringEnumType = {
  [key: string]: string
}
export const numberEnumToArray = (numberEnum: NumberEnumType) => {
  return Object.values(numberEnum).filter((value) => typeof value === 'number') as number[]
}
export const stringEnumToArray = (stringEnum: StringEnumType) => {
  return Object.values(stringEnum).filter((value) => typeof value === 'string') as string[]
}

function parseExpiration(exp: string): { value: number; unit: string } {
  const match = exp.match(/^(\d+)([smhdwMy])$/) // s: giây, m: phút, h: giờ, d: ngày, w: tuần, M: tháng, y: năm
  if (!match) {
    throw new Error(`Invalid expiration format: ${exp}`)
  }

  const value = parseInt(match[1], 10)
  const unit = match[2]

  return { value, unit }
}

export function convertToSeconds(exp: string): number {
  const { value, unit } = parseExpiration(exp)

  switch (unit) {
    case 's': // giây
      return value
    case 'm': // phút
      return value * 60
    case 'h': // giờ
      return value * 60 * 60
    case 'd': // ngày
      return value * 24 * 60 * 60
    case 'w': // tuần
      return value * 7 * 24 * 60 * 60
    case 'M': // tháng (ước lượng 30 ngày)
      return value * 30 * 24 * 60 * 60
    case 'y': // năm (ước lượng 365 ngày)
      return value * 365 * 24 * 60 * 60
    default:
      throw new Error(`Unsupported unit: ${unit}`)
  }
}
