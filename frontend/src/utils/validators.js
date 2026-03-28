export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password) => {
  const minLength = 6
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)

  return {
    isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber,
    errors: {
      length: password.length < minLength ? 'Password must be at least 6 characters' : '',
      uppercase: !hasUpperCase ? 'Password must contain at least one uppercase letter' : '',
      lowercase: !hasLowerCase ? 'Password must contain at least one lowercase letter' : '',
      number: !hasNumber ? 'Password must contain at least one number' : '',
    }
  }
}

export const validateUsername = (username) => {
  const minLength = 3
  const maxLength = 30
  const usernameRegex = /^[a-zA-Z0-9_]+$/

  return {
    isValid: username.length >= minLength && 
             username.length <= maxLength && 
             usernameRegex.test(username),
    errors: {
      length: username.length < minLength ? 'Username must be at least 3 characters' :
              username.length > maxLength ? 'Username cannot exceed 30 characters' : '',
      format: !usernameRegex.test(username) ? 'Username can only contain letters, numbers, and underscores' : ''
    }
  }
}

export const validateFile = (file) => {
  const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.presentationml.presentation']
  const maxSize = 10 * 1024 * 1024 // 10MB

  return {
    isValid: allowedTypes.includes(file.type) && file.size <= maxSize,
    errors: {
      type: !allowedTypes.includes(file.type) ? 'Only PDF, DOCX, and PPT files are allowed' : '',
      size: file.size > maxSize ? 'File size must be less than 10MB' : ''
    }
  }
}
