const TRANSLATIONS: Record<string, string> = {
  'User already registered': 'Ya existe una cuenta con ese email',
  'Invalid login credentials': 'Email o contraseña incorrectos',
  'Email not confirmed': 'Confirmá tu email antes de iniciar sesión',
  'Email rate limit exceeded': 'Demasiados intentos, esperá unos minutos y volvé a intentar',
  'Unable to validate email address: invalid format': 'El email no es válido',
  'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres',
  'New password should be different from the old password':
    'La nueva contraseña debe ser distinta a la anterior',
  'Signup requires a valid password': 'Ingresá una contraseña válida',
}

export function translateAuthError(message: string) {
  return TRANSLATIONS[message] ?? message
}
