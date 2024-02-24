const jwt = require('jsonwebtoken')
const { customError } = require('../handlers/error/customError')
const { errorCodes } = require('../handlers/error/errorCodes')

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization

    if (!authHeader?.startsWith('Bearer ')) {
        throw new customError(errorCodes.JWT_KEY_MISSING_ERROR)
    }

    const token = authHeader.split(' ')[1]

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) throw new customError(errorCodes.INVALID_TOKEN_OR_MISSING_CREDENTIALS_ERROR)
            req.user = decoded.UserInfo
            next()
        }
    )
}

module.exports = verifyJWT 