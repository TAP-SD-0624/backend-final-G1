const tokenBlacklist: Set<string> = new Set()

export function addToBlacklist(token: string): void {
  tokenBlacklist.add(token)
}

export function isTokenBlacklisted(token: string): boolean {
  return tokenBlacklist.has(token)
}

export function removeFromBlacklist(token: string): void {
  tokenBlacklist.delete(token)
}
