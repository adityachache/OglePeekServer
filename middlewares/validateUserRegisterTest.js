const { customerRegisterTestSchema } = require("./joiSchema")

module.exports.validateUserRegisterTest = (req, res, next) => {
    // console.log("Here");
    const { error } = customerRegisterTestSchema.validate(req.body)

    if (error) {
        const msg = error.details.map(el => el.message).join(', ')
        res.status(400).json({ message: msg })
    } else {
        // console.log("Customer Validated");
        next()
    }
}

