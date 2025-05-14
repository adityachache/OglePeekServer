const { customerRegisterTestSchema } = require("./joiSchema")

module.exports.validateCustomerRegisterTest = (req, res, next) => {
    const { error } = customerRegisterTestSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(', ')
        res.status(400).json({ message: msg })
    } else {
        next()
    }
}

