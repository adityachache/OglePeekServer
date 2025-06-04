const { customerLoginViaEmailTestSchema, customerLoginViaPhoneTestSchema } = require("./joiSchema")

module.exports.validateUserLoginViaEmailTest = (req, res, next) => {
    const { error } = customerLoginViaEmailTestSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(', ')
        res.status(400).json({ message: msg })
    } else {
        next()
    }
}

module.exports.validateUserLoginViaPhoneTest = (req, res, next) => {
    const { error } = customerLoginViaPhoneTestSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(', ')
        res.status(400).json({ message: msg })
    } else {
        next()
    }
}