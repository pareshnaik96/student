const subjectModel = require('../Models/subjectModel')
const mongoose = require('mongoose')


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

const isValid3 = function (subject) {
    let subjectRegex = /^[a-zA-Z ]{2,}$/
    return subjectRegex.test(subject)
};

const isValid4 = function (mark) {
    let markRegex = /^[0-9]*$/
    return markRegex.test(mark)
};

const createSubject = async function (req, res) {
    try {

        let data = req.body

        if (!isvalidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "data not found" });

        } else {

            const { name, subject, mark } = data;

            const findData = await subjectModel.findOne({ name, subject })
            let newMarks = 0
            if (findData) {
                const findMarks = findData.mark
                newMarks = findMarks + mark
            }

            let updatedMark = await subjectModel.findOneAndUpdate({ name: name, subject: subject }, { $set: { mark: newMarks } }, { new: true }).select({ "items._id": 0, __v: 0 })
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
            if (!isValid3(subject)) {
                return res.status(400).send({ status: false, message: "please enter valid subject" });
            }
            if (!isValid(mark)) {
                return res.status(400).send({ status: false, message: "mark is required" });
            }
            if (!isValid4(mark)) {
                return res.status(400).send({ status: false, message: "please enter valid mark" });
            }

            let Subject = await subjectModel.create(data)
            return res.status(201).send({ status: true, message: "Subject created successfully", data: Subject })
        }

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

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

        let student = await subjectModel.find(filter).select({ _id: 1, name: 1, subject: 1 , mark:1 })

        if (student && student.length === 0)
            return res.status(404).send({ status: false, message: "no such document exist or it maybe deleted" })

        return res.status(200).send({ status: true, message: "student list accessed successfully", data: student })


    }
    catch (error) {
        return res.status(500).send({ status: false, message: "Error", error: error.message })
    }
}


const updateSubject = async function (req, res) {

    try {

        let subjectId = req.params.subjectId;


        // if (!isValidObjectId(subjectId))
        //     return res.status(400).send({ status: false, message: "Not a valid student ID" });


        let studentDetails = await subjectModel.findById(subjectId);
        if (!studentDetails)
            return res.status(404).send({ status: false, message: "Student data not found." });

        let data = req.body;


        if (Object.keys(req.body).length == 0)
            return res.status(400).send({ status: false, message: "NO INPUT BY USER" });

        let { name, subject, mark } = data;

        let updatedStudent = await subjectModel.findOneAndUpdate(
            { _id: subjectId }, { $set: { name, subject, mark, updatedAt: Date.now() } }, { new: true }
        );
        return res.status(200).send({ status: true, message: "Student profile updated", data: updatedStudent });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}


const deleteSubject = async function (req, res) {

    try {

        let studentId = req.params.studentId;

        if (!isValidObjectId(studentId)) {
            return res.status(400).send({ status: false, message: "Student Id is  Invalid" })
        }

        let studentdata = await subjectModel.findOne({ _id: studentId, isDeleted: false });

        if (!studentdata) {
            return res.status(404).send({ status: false, message: "Student Data Not found" });
        }
        await subjectModel.findOneAndUpdate({ _id: subjectId }, { isDeleted: true, deletedAt: Date() }, { new: true });

        return res.status(200).send({ status: true, message: "Student deleted successfull" });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }

}


module.exports.createSubject = createSubject
module.exports.getStudent = getStudent
module.exports.updateSubject = updateSubject
module.exports.deleteSubject = deleteSubject