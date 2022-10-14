const express = require('express')
const router = express.Router()
const studentController = require('../Controllers/studentController')
const middleware = require('../Middleware/auth')


router.post('/register',studentController.createStudent)

router.post('/login',studentController.login)

router.get('/student',middleware.authentication,studentController.getStudent)

router.get('/student/:studentId',middleware.authentication,studentController.getStudentById)

router.put('/student/:studentId',middleware.authentication,middleware.authorization,studentController.updateStudent)

router.delete('/student/:studentId',middleware.authentication,middleware.authorization,studentController.deleteStudent)

module.exports = router;