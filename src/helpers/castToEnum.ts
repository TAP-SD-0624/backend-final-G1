export function castToEnum<T extends { [key: string]: string }>(
  enumType: T,
  value: string
): T[keyof T] | undefined {
  if (Object.values(enumType).includes(value as T[keyof T])) {
    return value as T[keyof T]
  }
  return undefined
}
