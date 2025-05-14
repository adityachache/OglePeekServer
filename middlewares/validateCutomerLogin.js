const { loginViaEmailSchema, loginViaPhoneSchema } = require("./joiSchema")

module.exports.validateCustomerLoginViaEmail = (req, res, next) => {
    const { error } = loginViaEmailSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(', ')
        res.status(400).json({ message: msg })
    } else {
        next()
    }
}

module.exports.validateCustomerLoginViaPhone = (req, res, next) => {
    const { error } = loginViaPhoneSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(', ')
        res.status(400).json({ message: msg })
    } else {
        next()
    }
}