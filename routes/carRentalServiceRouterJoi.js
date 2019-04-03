const Joi = require('joi');

const getSchema = Joi.object({
    name: Joi.string().required()
});

const deleteSchema = Joi.object({
    name: Joi.string().required()
});

const putSchema = Joi.object ({
    name: Joi.string().required(),
    address: Joi.string().required(),
    description: Joi.string().required()
});

const carGetSchema = Joi.object({
    registration: Joi.string().required()
});

const carPostSchema = Joi.object({
    registration: Joi.string().required(),
    make: Joi.string().required(), 
    serviceName: Joi.string().required(),
    category: Joi.string().required(),
    seats: Joi.number().required()
});

const carDeleteSchema = Joi.object({
    registration: Joi.string().required()
})

exports.rentalServiceGetSchema = getSchema;
exports.rentalServiceDeleteSchema = deleteSchema;
exports.rentalServicePutSchema = putSchema;
exports.carGetSchema = carGetSchema;
exports.carPostSchema = carPostSchema;
exports.carDeleteSchema = carDeleteSchema;