export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;
export const phoneRegex = /^\+?[\d\s\-()]{7,20}$/;

export function isValidEmail(email: string): boolean {
  return emailRegex.test(email);
}

export function isValidPassword(password: string): boolean {
  return password.length >= 12 && password.length <= 128 && passwordRegex.test(password);
}

export function isValidPhone(phone: string): boolean {
  return phoneRegex.test(phone);
}

export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  if (password.length < 8) return 'weak';
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[\W_]/.test(password);
  const score = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;
  if (score <= 2) return 'weak';
  if (score === 3 || password.length < 12) return 'medium';
  return 'strong';
}
