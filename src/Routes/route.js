const express = require('express')
const router = express.Router()
const studentController = require('../Controllers/studentController')
const subjectController = require('../Controllers/subjectController')
const middleware = require('../Middleware/auth')


router.post('/register',studentController.createStudent)
router.post('/login',studentController.loginStudent)

router.post('/subject/:studentId',middleware.authentication,middleware.authorization,subjectController.createSubject )
router.get('/student',middleware.authentication,subjectController.getStudent)
router.put('/student/:subjectId',middleware.authentication,middleware.authorization,subjectController.updateSubject)
router.delete('/student/:subjectId',middleware.authentication,middleware.authorization,subjectController.deleteSubject)

module.exports = router;