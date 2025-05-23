const { customerLoginViaEmailTestSchema, customerLoginViaPhoneTestSchema } = require("./joiSchema")

module.exports.validateCustomerLoginViaEmailTest = (req, res, next) => {
    const { error } = customerLoginViaEmailTestSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(', ')
        res.status(400).json({ message: msg })
    } else {
        next()
    }
}

module.exports.validateCustomerLoginViaPhoneTest = (req, res, next) => {
    const { error } = customerLoginViaPhoneTestSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(', ')
        res.status(400).json({ message: msg })
    } else {
        next()
    }
}