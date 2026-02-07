import validator from 'validator'

const validateSignupData = (req) => {
  const { firstName, lastName, email, password } = req.body

  if (!firstName || !lastName) {
    throw new Error('Enter a valid first or last name')
  } else if (!validator.isEmail(email)) {
    throw new Error('Enter a valid Email ID')
  } else if (!validator.isStrongPassword(password)) {
    throw new Error('Enter a strong password')
  }
}
export default validateSignupData
