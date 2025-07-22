const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const {
    getTutors,
    getStudents,
    getAttendanceRecords,
    submitAttendance,
    getRecordDetails,
    deleteAttendanceRecord,
    updateAttendanceRecord,
    getAttendanceStats
} = require('../controllers/attendanceController');

// Public endpoints (no auth required)
router.get('/tutors', getTutors);
router.get('/students', getStudents);
// Require authentication for attendance records
// Change this line from:
// router.get('/attendance', requireAuth, attendanceController.getAttendanceRecords);
// To this:
router.get('/attendance', requireAuth, getAttendanceRecords);
router.get('/stats', getAttendanceStats);

// Protected endpoints (auth required)
router.post('/attendance', requireAuth, submitAttendance);
router.get('/records/:record_id', requireAuth, getRecordDetails);
router.patch('/attendance/:record_id', requireAuth, updateAttendanceRecord);
router.delete('/attendance/:record_id', requireAuth, deleteAttendanceRecord);

module.exports = router;