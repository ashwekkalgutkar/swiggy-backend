const mongoose = require('mongoose');


const connection = mongoose.connect(process.env.url);

const empSchema = mongoose.Schema({
    firstName : {type : String},
    lastName : {type : String},
    email : {type : String},
    salary : {type : Number},
    date : {type : String},
})

const userSchema = mongoose.Schema({
    email:{type : String},
    password : {type : String},
    confirmPassword : {type : String},
})

const employeeModule = mongoose.model("empdata" , empSchema);
const userModel = mongoose.model("user" , userSchema);

module.exports = {connection , employeeModule , userModel}