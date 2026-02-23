export const API_BASE_URL = 'http://24.144.93.15:3333'

export const apiUrl = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path
  return `${API_BASE_URL}/${normalizedPath}`
}
