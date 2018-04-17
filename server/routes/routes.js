const express = require('express');
const router = express.Router();
const authenticate = require('../config/auth');


// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

var routes = {
  views: {
       common: require("../views/common"),
       students: require("../views/students"),
       teachers: require("../views/teachers")
  }
}

// student
router.post('/student/login', routes.views.students.login);
router.post('/student/dashboard', authenticate, routes.views.students.dashboard);
router.post('/student/assignments', authenticate, routes.views.students.assignments);
router.post('/student/upload/submission', authenticate, routes.views.students.submissions)
router.post('/student/get/submissions', authenticate, routes.views.students.getSubmissions)
router.post('/student/view/submission', authenticate, routes.views.students.viewSubmissions)
router.post('/student/delete/submission', authenticate, routes.views.students.deleteSubmission)


//teacher
router.post('/teacher/login', routes.views.teachers.login);
router.post('/teacher/dashboard', authenticate, routes.views.teachers.dashboard);
router.post('/teacher/assignments', authenticate, routes.views.teachers.assignments);
router.post('/teacher/post/assignment', authenticate, routes.views.teachers.submissions)
router.post('/teacher/get/submissions', authenticate, routes.views.teachers.getSubmissions)
router.post('/teacher/view/submission', authenticate, routes.views.teachers.viewSubmissions)
router.post('/teacher/delete/submission', authenticate, routes.views.teachers.deleteSubmission)
router.post('/teacher/delete/assignment', authenticate, routes.views.teachers.deleteAssignment)
router.post('/teacher/evaluate/submission', authenticate, routes.views.teachers.evaluateSubmission)


module.exports = router;
