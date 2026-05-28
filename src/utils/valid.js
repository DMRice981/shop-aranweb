export function isPhone(phone) {
  return /^1[3-9]\d{9}$/.test(phone)
}

export function isEmail(email) {
  return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(email)
}

export function isPassword(password) {
  return password && password.length >= 6
}

export function isNotEmpty(value) {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return true
}
