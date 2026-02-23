export const API_BASE_URL = '/api'

export const apiUrl = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path
  return `${API_BASE_URL}/${normalizedPath}`
}
