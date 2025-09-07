export interface User {
  id: string
  email: string
  name: string
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  try {
    const userStr = localStorage.getItem("healthmetrica_user")
    return userStr ? JSON.parse(userStr) : null
  } catch {
    return null
  }
}

export function logout() {
  localStorage.removeItem("healthmetrica_auth")
  localStorage.removeItem("healthmetrica_user")
  window.location.href = "/login"
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem("healthmetrica_auth") === "true"
}
