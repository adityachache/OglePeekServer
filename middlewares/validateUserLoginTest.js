const { userLoginViaEmailTestSchema, userLoginViaPhoneTestSchema } = require("./joiSchema")

module.exports.validateUserLoginViaEmailTest = (req, res, next) => {
    const { error } = userLoginViaEmailTestSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(', ')
        res.status(400).json({ message: msg })
    } else {
        next()
    }
}

module.exports.validateUserLoginViaPhoneTest = (req, res, next) => {
    const { error } = userLoginViaPhoneTestSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(', ')
        res.status(400).json({ message: msg })
    } else {
        next()
    }
}