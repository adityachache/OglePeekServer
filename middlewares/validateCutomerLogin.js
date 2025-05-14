const { loginViaEmailSchema, loginViaPhoneSchema } = require("./joiSchema")

module.exports.validateUserLoginViaEmail = (req, res, next) => {
    const { error } = loginViaEmailSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(', ')
        res.status(400).json({ message: msg })
    } else {
        next()
    }
}

module.exports.validateUserLoginViaPhone = (req, res, next) => {
    const { error } = loginViaPhoneSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(', ')
        res.status(400).json({ message: msg })
    } else {
        next()
    }
}