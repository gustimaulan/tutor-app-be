const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const {
    getStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
    getStudentStats
} = require('../controllers/studentsController');

// Public endpoints (no auth required)
router.get('/students', getStudents);
router.get('/students/stats', getStudentStats);

// Protected endpoints (auth required)
router.get('/students/:id', requireAuth, getStudentById);
router.post('/students', requireAuth, createStudent);
router.patch('/students/:id', requireAuth, updateStudent);
router.delete('/students/:id', requireAuth, deleteStudent);

module.exports = router; 