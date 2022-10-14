const studentModel = require('../Models/studentModel')
const mongoose = require('mongoose')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");


const isValid = function (value) {
    if (typeof value == "undefined" || value == null) return false;
    if (typeof value == "string" && value.trim().length == 0) return false;
    return true;
};

const isvalidRequestBody = function (requestbody) {
    return Object.keys(requestbody).length > 0;
}

const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

const isValid1 = function (name) {
    let nameRegex = /^[a-zA-Z ]{2,}$/
    return nameRegex.test(name)
};

const isValid2 = function (subject) {
    let subjectRegex = /^[a-zA-Z ]{2,}$/
    return subjectRegex.test(subject)
};

const isValid3 = function (mark) {
    let markRegex = /^[0-9]*$/
    return markRegex.test(mark)
};

const isValid4 = function (email) {
    let emailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    return emailRegex.test(email)
};

//===========================================================================================================//

const createStudent = async function (req, res) {
    try {

        let data = req.body

        if (!isvalidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "data not found" });

        } else {

            const { name, subject, mark, email, password } = data;

            const findData = await studentModel.findOne({ name, subject })
            let newMarks = 0
            if (findData) {
                const findMarks = findData.mark
                newMarks = findMarks + mark
            }

            let updatedMark = await studentModel.findOneAndUpdate({ name: name, subject: subject }, { $set: { mark: newMarks } }, { new: true }).select({ "items._id": 0, __v: 0 })
            if (updatedMark) {
                return res.status(200).send({ status: true, message: "mark is added", data: updatedMark })
            }

            if (!isValid(name)) {
                return res.status(400).send({ status: false, message: "name is required" });
            }
            if (!isValid1(name)) {
                return res.status(400).send({ status: false, message: "please enter valid name" });
            }
            if (!isValid(subject)) {
                return res.status(400).send({ status: false, message: "subject is required" });
            }
            if (!isValid2(subject)) {
                return res.status(400).send({ status: false, message: "please enter valid subject" });
            }
            if (!isValid(mark)) {
                return res.status(400).send({ status: false, message: "mark is required" });
            }
            if (!isValid3(mark)) {
                return res.status(400).send({ status: false, message: "please enter valid mark" });
            }
            if (!isValid(email)) {
                return res.status(400).send({ status: false, message: "email is required" });
           }
           if (!isValid4(email)) {
                return res.status(400).send({ status: false, message: "please enter valid email" });
           }
       
           let uniqueEmail = await userModel.findOne({ email });
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
           
           const saveData = { name:name, subject:subject, mark:mark, email:email, password:Password }
            
            let Student = await studentModel.create(saveData)
            return res.status(201).send({ status: true, message: "Student created successfully", data: Student})
        }

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

//================================================================================================================//

const login = async function (req,res) {
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
    
        const checkedUser = await studentModel.findOne({ email });
        if (!checkedUser) {
            return res.status(404).send({ status: false, message: "No Student with this emailId" });
        }
        
        let userId = checkedUser._id.toString()
        
        const match = await bcrypt.compare(password, checkedUser.password);
        if (!match) {
            return res.status(400).send({ status: false, message: "password wrong" });
        }

        //To create token
        let token = jwt.sign({
            userId: userId,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 10*60*60
        }, "student@key");

        res.setHeader("x-api-key", token);
        return res.status(200).send({ status: true, message: "Student login sucessfull", data: { token } })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: "Error", error: error.message })
    }
}

//==============================================================================================================//


const getStudent = async function (req, res) {

    try {

        let data = req.query
        let { name, subject } = data


        let filter = { isDeleted: false }


        if (isValid(name)) {
            filter["name"] = name
        }

        if (isValid(subject)) {
            filter["subject"] = subject
        }

        let student = await studentModel.find(filter).select({_id:0, name: 1, subject: 1 , mark:1 })

        if (student && student.length === 0)
            return res.status(404).send({ status: false, message: "no such document exist or it maybe deleted" })

        return res.status(200).send({ status: true, message: "student list accessed successfully", data: student })


    }
    catch (error) {
        return res.status(500).send({ status: false, message: "Error", error: error.message })
    }
}

//====================================================================================================================//


const updateStudent = async function (req, res) {

    try {

        let studentId = req.params.studentId;

        if (!isValidObjectId(studentId))
            return res.status(400).send({ status: false, message: "Not a valid student ID" });

        let studentID = await studentModel.findById(studentId);
        if (!studentID)
            return res.status(404).send({ status: false, message: "Student Data Not found by this Id." });

        let data = req.body;

        if (Object.keys(req.body).length == 0)
            return res.status(400).send({ status: false, message: "NO INPUT BY USER" });

        let { name, subject, mark } = data;

        let updatedStudent = await studentModel.findOneAndUpdate(
            { _id: studentID }, { $set: { name, subject, mark, updatedAt: Date.now() } }, { new: true }
        );
        return res.status(200).send({ status: true, message: "Student profile updated", data: updatedStudent });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

//========================================================================================================================//


const deleteStudent = async function (req, res) {

    try {

        let studentId = req.params.studentId;
        console.log(studentId)

        if (!isValidObjectId(studentId)) {
            return res.status(400).send({ status: false, message: "Student Id is  Invalid" })
        }

        let studentdata = await studentModel.findOne({ _id: studentId, isDeleted: false });
        console.log(studentdata)

        if (!studentdata) {
            return res.status(404).send({ status: false, message: "Student Data Not found" });
        }
        await studentModel.findOneAndUpdate({ _id: studentId }, { isDeleted: true, deletedAt: Date() }, { new: true });

        return res.status(200).send({ status: true, message: "Student deleted successfull" });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }

}


module.exports.createStudent = createStudent
module.exports.login=login
module.exports.getStudent = getStudent
module.exports.updateStudent = updateStudent
module.exports.deleteStudent = deleteStudent