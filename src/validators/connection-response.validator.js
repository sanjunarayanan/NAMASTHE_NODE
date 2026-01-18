export const validateConnectionResponse = (req, res, next) => {
  const { status } = req.body
  const ALLOWED_STATUS = ['Accepted', 'Rejected']

  if (!ALLOWED_STATUS.includes(status)) {
    return res.status(400).send({
      message: `Status '${status}' is not allowed`,
    })
  }

  next()
}

export default validateConnectionResponse
