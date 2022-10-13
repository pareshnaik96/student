const jwt = require("jsonwebtoken");
const mongoose = require('mongoose')
const studentModel = require("../Models/studentModel");

const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}


// Authentication
const authentication = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        if (!token) token = req.headers["X-Api-Key"]
        if (!token) return res.status(400).send({ status: false, message: "You are not logged in. Token is required." })
       
        let decodeToken = jwt.verify(token, "student@key")
        if(!decodeToken){
            return res.status(401).send({status: false, message: "You are not authenticate"})
        }
        req.decodeToken = decodeToken
        next()
    } catch (error) {
        return res.status(500).send({ status: false, message: "Error", error: error.message })
    }
}

//AuthoriZation
const authorization = async function (req, res, next) {
    try {

        let studentId = req.params.studentId
        let decodeToken = req.decodeToken

        if (!isValidObjectId(studentId)) return res.status(400).send({ status: false, message: "Not a valid student Id" })

        let getStudent = await studentModel.findById(studentId)
        if (!getStudent) return res.status(404).send({ status: false, message: "Student Not Found." })
        if (decodeToken.studentId !== studentId ) return res.status(403).send({ status: false, message: "You are not authorize to perform the action." })
        next();
    }
    catch (error) {
        console.log(error.message)
        return res.status(500).send({ status: false, error: error.message })
    }
}

module.exports.authentication = authentication
module.exports.authorization = authorization

