const Joi = require('joi');
const mongoose = require('mongoose');
var bcrypt = require('bcrypt');
const { array } = require('joi');


const User = mongoose.model('users',new mongoose.Schema({
    username:{
        type:String,
        required:true,
        minlength:4,
        maxlength:12,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        minlength:4,
        maxlength:2500,
    }
}))



function validateUser(user){
    const schema = Joi.object({
        username : Joi.string().min(4).max(12).required(),
        email : Joi.string().email().required(),
        password : Joi.string().required().min(4).max(12),
        confirm_password:Joi.any().equal(Joi.ref('password'))
        .required()
        .label('Confirm password')
        .options({ messages: { 'any.only': '{{#label}} and Password does not match'} })
    })

    return schema.validate(user)
}

async function hashingAndInsertion(user){
    let salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt);
    await user.save();
}

module.exports = {
    User : User,
    validate : validateUser,
    hashingAndInsertion : hashingAndInsertion,
}