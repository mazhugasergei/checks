interface User {
  username: string
  firstName: string
  middleName?: string | null
  lastName: string
}

interface UserJWTPayload {
  id: number
}
