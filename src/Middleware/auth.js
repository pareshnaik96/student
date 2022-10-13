// const jwt = require("jsonwebtoken");
const mongoose = require('mongoose')
const studentModel = require("../Models/studentModel");

// const isValidObjectId = function (ObjectId) {
//     return mongoose.Types.ObjectId.isValid(ObjectId)
// }


//Authentication
// const authentication = function (req, res, next) {
//     try {
//         let token = req.headers["x-api-key"]
//         if (!token) token = req.headers["X-Api-Key"]
//         if (!token) return res.status(400).send({ status: false, message: "You are not logged in. Token is required." })
       
//         let decodeToken = jwt.verify(token, "student@key")
//         if(!decodeToken){
//             return res.status(401).send({status: false, message: "You are not authenticate"})
//         }
//         req.decodeToken = decodeToken
//         next()
//     } catch (error) {
//         return res.status(500).send({ status: false, message: "Error", error: error.message })
//     }
// }
// //AuthoriZation
// const authorization = async function (req, res, next) {
//     try {
//         let studentId = req.params.studentId
//         let decodeToken = req.decodeToken
//         // if (!isValidObjectId(studentId)) return res.status(400).send({ status: false, message: "Not a valid student Id" })
//         let getStudent = await studentModel.findOne()
//         console.log(getStudent)
//         if (!getStudent) return res.status(404).send({ status: false, message: "Student Not Found." })
//         if (decodeToken.subjectId !== getStudent._id ) return res.status(403).send({ status: false, message: "You are not authorize to perform the action." })
//         next();
//     }
//     catch (error) {
//         console.log(error.message)
//         return res.status(500).send({ status: false, error: error.message })
//     }
// }
// const authorization = async (req, res, next) => {
//     try {
//         let userId = req.params.userId;
//         let userIdfromToken = req.decodedToken.userId;

//         if (!validator.vaildObjectId(userId))
//             return res.status(400).send({ status: false, message: "Please enter vaild User id in params." });

//         // if(!userId) return res.status(400).send({ status: false, message: "User-id is required" })

//         let findUser = await userModel.findOne({ _id: userId })
//         if (!findUser) {
//             return res.status(400).send({ status: false, message: "User not found." });
//         }

//         if (findUser._id.toString() !== userIdfromToken) {
//             res.status(401).send({ status: false, message: "Unauthorized access!!" });
//         }

//         next();
//     } catch (err) {
//         res.status(500).send({ status: false, error: err.message });
//     }
// };



const jwt = require("jsonwebtoken");
// const bookModel = require("../Models/bookModel");
// mongoose = require("mongoose")

const tokenRegex = /^[A-Za-z0-9-=]+\.[A-Za-z0-9-=]+\.?[A-Za-z0-9-_.+/=]*$/

const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}


const authentication = async function (req, res, next) {
    try {
        let token = (req.headers["x-api-key"])
        let secretKey = "student@key"


        if (!token) {
            return res.status(400).send({ status: false, msg: "Token must be present", });
        }

        if (!tokenRegex.test(token))
            return res.status(400).send({ status: false, message: "Please provide a valid token." })

        let decodedToken = jwt.verify(token, secretKey)

        if (!decodedToken) {
            return res.status(401).send({ status: false, msg: "Authentication error" });
        }
        req.decodedToken = decodedToken

        next()


    }
    catch (err) {
        res.status(500).send({ msg: "Error", error: err.message })
    }

}

const authorization = async function (req, res, next) {
    try {


        let subjectId = req.params.subjectId

        let decodedToken = req.decodedToken

        // if (!isValidObjectId(studentId)) return res.status(400).send({ status: false, message: "Please provide valid student Id" })


        const findStudent = await studentModel.findOne({ _Id: subjectId, isDeleted: false })

        if (!findStudent)
            res.status(404).send({ status: false, msg: "No student found or it maybe deleted" });



        if (decodedToken.studentId = findStudent.studentId) {
            next()
        } else {
            res.status(401).send({ status: false, msg: "student logged in is not allowed to modify or access the data" });
        }
    }

    catch (err) {
        res.status(500).send({ msg: "Error", error: err.message })
    }

}

module.exports.authentication = authentication
module.exports.authorization = authorization


// module.exports.authentication = authentication
// module.exports.authorization = authorization
