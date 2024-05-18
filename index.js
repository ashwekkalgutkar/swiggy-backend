const express = require('express');
const app = express();
app.use(express.json());
require('dotenv').config(); 
const jwt = require('jsonwebtoken');
const cors = require('cors');
app.use(cors());
const bcrypt = require('bcrypt');
const {connection , employeeModule , userModel} = require('./db')
const port = process.env.PORT;

app.post("/signup", async(req , res)=>{
    const { email , password , confirmPassword} = req.body;
    try {
    if(!email || !password || !confirmPassword){
        res.send('All filled required')
    }
    const avil = await userModel.find({email:email});
    if(avil.length !== 0){
        res.send('Email Alreday Exist')
    }else{
    const hash = bcrypt.hash(password , 6 , async function(err , hash){
        if(err){
            console.log(err)
        }else{
            await userModel.create({email:email , password: hash , confirmPassword:confirmPassword});
            res.status(201).send({email:email , password: password});
            console.log('user created');
        }
    })
}
} catch (error) {
    console.log('error from post user function' , error);
}
})


app.post("/login"  , async(req , res)=>{
    const {email , password} = req.body;
    const user = await userModel.findOne({email:email});
    console.log(user)
    const hashed = user.password;
    try {
         bcrypt.compare(password , hashed , function(err , result){
            if(result == true){
                console.log(result);
                const token = jwt.sign({userId : user._id} , "narsimma");
                res.cookie('token' ,token , {
                    maxAge : 15 * 24 * 60 * 60 * 1000, 
                    httpOnly : true ,
                    sameSite:"strict",
                    secure : process.env.NODE_ENV !== "development" 
                });
                res.status(201).send({message :'User Found' , token:token})
            }else{
                res.status(404).send(err + "user not found")
            }
        })
    } catch (error) {
        console.log('Error From login function   :'+error)
    }
})
app.get("/" , async(req , res)=>{
    try {
        const data = await employeeModule.find();
        res.send(data);
        console.log('data recived');
    } catch (error) {
        console.log(error)
    }
})

app.post('/employees', async(req, res) => {
    try {
        const data = await employeeModule.create(req.body);
        res.send(data);
        console.log(data);
        
    } catch (error) {
        console.log('this error from post fun' + error)
    }
});

app.put('/employee/:id', async(req, res) => {
    try {
        const data = req.body;
       
        const update = await employeeModule.findById(req.params.id);
        update.firstName = data.firstName || update.firstName;
        update.lastName = data.lastName || update.lastName;
        update.email = data.email || update.email;
        update.salary = data.salary || update.salary;
        update.date = data.date || update.date;
        
    
        const updated_Product = await update.save();
        res.status(200).send(updated_Product);
        console.log('data updated');
    } catch (error) {
     console.log(error + 'this error from put fun')       
    }
});

app.delete('/employee/:id', async(req, res) => {
    try {
        const data = await Product_module.findByIdAndDelete(req.params.id);
        res.status(200).send(data);
        console.log('data deleted');
    } catch (error) {
        console.log(error + 'this error from delete fun')
    }
});

app.listen(port , ()=>{
    try {
        console.log(`Server is live on port ${port}`)
    } catch (error) {
        console.log('Connection error')
    }
})