const Joi = require('joi');

module.exports.registerSchema = Joi.object({
    name: Joi.string().required().alphanum().min(3).max(25),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    password: Joi.string().required().min(8),
    captchaValue: Joi.string().required()
})

module.exports.loginViaEmailSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required().min(8),
    captchaValue: Joi.string().required()
})

module.exports.loginViaPhoneSchema = Joi.object({
    phone: Joi.string().required(),
    password: Joi.string().required().min(8),
    captchaValue: Joi.string().required()
})

module.exports.userRegisterTestSchema = Joi.object({
    name: Joi.string().required().alphanum().min(3).max(25),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    password: Joi.string().required().min(8)
})

module.exports.userLoginViaEmailTestSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required().min(8)
})

module.exports.userLoginViaPhoneTestSchema = Joi.object({
    phone: Joi.string().required(),
    password: Joi.string().required().min(8)
})