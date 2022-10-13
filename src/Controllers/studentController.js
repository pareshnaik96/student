const studentModel = require('../Models/studentModel')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");
// const mongoose = require('mongoose')

const isValid = function (value) {
    if (typeof value == "undefined" || value == null) return false;
    if (typeof value == "string" && value.trim().length == 0) return false;
    return true;
  };
  
const isvalidRequestBody = function (requestbody) {
    return Object.keys(requestbody).length > 0;
  }
  
//   const isValidObjectId = function (ObjectId) {
//     return mongoose.Types.ObjectId.isValid(ObjectId)
// }

const isValid1 = function (name) {                                                              
    let nameRegex = /^[a-zA-Z ]{2,}$/
    return nameRegex.test(name)
};

const isValid2 = function (email) {
    let emailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    return emailRegex.test(email)
};


const createStudent = async function(req,res){
    try{

      let data = req.body
      if (!isvalidRequestBody(data)) {
        return res.status(400).send({ status: false, message: "data not found" });

      } else {

    const { name, email,password } = data;


    if (!isValid(name)) {
         return res.status(400).send({ status: false, message: "name is required" });
    } 
    if (!isValid1(name)) {
         return res.status(400).send({ status: false, message: "please enter valid name" });
    } 
    
    if (!isValid(email)) {
         return res.status(400).send({ status: false, message: "email is required" });
    }
    if (!isValid2(email)) {
         return res.status(400).send({ status: false, message: "please enter valid email" });
    }

    let uniqueEmail = await studentModel.findOne({ email });
    if (uniqueEmail){
         return res.status(400).send({ status: false, message: "email already exist" });
    }

    if (!isValid(password)) {
        return res.status(400).send({ status: false, message: "password is required" });
    }
    if (password.length < 8 || password.length > 15) {
        return res.status(400).send({ status: false, message: "password must be 8-15 characters" });
    }
    
    const saltRounds = 10
    Password = await bcrypt.hash(password, saltRounds);
    
    const saveData = { name:name, email:email,password:Password }

    let Student = await studentModel.create(saveData)
      return res.status(201).send({status:true,message:"Student created successfully",data:Student})
    }

    }catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
}


const loginStudent = async function (req,res) {
    try {

        let email = req.body.email;
        let password = req.body.password;

        if (!email) {
            return res.status(400).send({ status: false, message: "email is required" });
        }
    
        if (!password) {
            return res.status(400).send({ status: false, message: "password is required" });
        }
    
        const validEmail = validator.isEmail(email)
        if (!validEmail) {
            return res.status(400).send({ status: false, message: "email is not valid" });
        }
    
        const checkedStudent = await studentModel.findOne({ email });
        if (!checkedStudent) {
            return res.status(404).send({ status: false, message: "No student with this emailId" });
        }
    
        let studentId = checkedStudent._id.toString()
    
        const match = await bcrypt.compare(password, checkedStudent.password);
        if (!match) {
            return res.status(400).send({ status: false, message: "password wrong" });
        }

        //To create token
        let token = jwt.sign({
            studentId: studentId,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 10*60*60
        }, "student@key");

        res.setHeader("x-api-key", token);
        return res.status(200).send({ status: true, message: "Student login sucessful", data: { token } })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: "Error", error: error.message })
    }
}

module.exports.createStudent=createStudent
module.exports.loginStudent=loginStudent