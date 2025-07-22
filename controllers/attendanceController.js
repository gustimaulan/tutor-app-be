const { supabase, supabaseAdmin } = require('../config/supabase');
const { toJakartaTime, formatJakartaDate, formatJakartaTime } = require('../utils/timezone');

// Get all tutors (unique names from attendance records)
const getTutors = async (req, res) => {
  try {
    const { data: tutors, error } = await supabase
      .from('attendance_records')
      .select('tutor_name, email')
      .order('tutor_name');

    if (error) {
      console.error('Get tutors error:', error);
      return res.status(500).json({ error: 'Failed to fetch tutors' });
    }

    // Get unique tutor names with emails
    const uniqueTutors = tutors.reduce((acc, tutor) => {
      const existing = acc.find(t => t.name === tutor.tutor_name);
      if (!existing) {
        acc.push({ name: tutor.tutor_name, email: tutor.email });
      }
      return acc;
    }, []);

    res.json(uniqueTutors);
  } catch (error) {
    console.error('Get tutors error:', error);
    res.status(500).json({ error: 'Failed to fetch tutors' });
  }
};

// Get all students (unique names from attendance records)
const getStudents = async (req, res) => {
  try {
    const { data: students, error } = await supabase
      .from('attendance_records')
      .select('student_name')
      .order('student_name');

    if (error) {
      console.error('Get students error:', error);
      return res.status(500).json({ error: 'Failed to fetch students' });
    }

    // Get unique student names
    const uniqueStudents = [...new Set(students.map(s => s.student_name))].map(name => ({ name }));
    res.json(uniqueStudents);
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

// Get attendance records with pagination
const getAttendanceRecords = async (req, res) => {
  try {
    const { page = 1, limit = 10, tutor_name, student_name, tutoring_date } = req.query;
    const offset = (page - 1) * limit;
    
    console.log('Query params:', { page, limit, tutor_name, student_name, tutoring_date });
    console.log('User from auth middleware:', req.user);

    let query = supabase
      .from('attendance_records')
      .select('*')
      .order('timestamp', { ascending: false });

    // Apply filters
    if (tutor_name) {
      query = query.eq('tutor_name', tutor_name);
    }
    if (student_name) {
      query = query.eq('student_name', student_name);
    }
    if (tutoring_date) {
      query = query.eq('tutoring_date', tutoring_date);
    }

    // Get total count with the same filters
    let countQuery = supabase
      .from('attendance_records')
      .select('*', { count: 'exact', head: true });

    // Apply the same filters to count query
    if (tutor_name) {
      countQuery = countQuery.eq('tutor_name', tutor_name);
    }
    if (student_name) {
      countQuery = countQuery.eq('student_name', student_name);
    }
    if (tutoring_date) {
      countQuery = countQuery.eq('tutoring_date', tutoring_date);
    }

    const { count, error: countError } = await countQuery;
      
    console.log('Total count (filtered):', count);
    if (countError) console.error('Count error:', countError);

    // Get paginated data
    const { data: records, error } = await query
      .range(offset, offset + limit - 1);
      
    console.log('Records found:', records?.length);
    if (error) console.error('Records error:', error);

    if (error) {
      console.error('Get attendance records error:', error);
      return res.status(500).json({ error: 'Failed to fetch attendance records' });
    }

    // Transform data to match your format with Jakarta timezone
    const transformedRecords = records.map(record => {
      return {
        record_id: record.record_id,
        timestamp: toJakartaTime(record.timestamp),
        tutor_name: record.tutor_name,
        email: record.email,
        tutoring_date: record.tutoring_date,
        tutoring_time: record.tutoring_time,
        student_name: record.student_name,
        proof_of_teaching: record.proof_of_teaching
      };
    });

    res.json({
      records: transformedRecords,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get attendance records error:', error);
    res.status(500).json({ error: 'Failed to fetch attendance records' });
  }
};

// Submit new attendance record
const submitAttendance = async (req, res) => {
  try {
    const { tutor_name, email, tutoring_date, tutoring_time, student_name, proof_of_teaching } = req.body;

    if (!tutor_name || !tutoring_date || !tutoring_time || !student_name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data: record, error } = await supabaseAdmin
      .from('attendance_records')
      .insert([
        {
          tutor_name,
          email,
          tutoring_date,
          tutoring_time,
          student_name,
          proof_of_teaching,
          created_by: req.user.id
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Submit attendance error:', error);
      return res.status(500).json({ error: 'Failed to submit attendance' });
    }

    // Transform response to match your format with Jakarta timezone
    const transformedRecord = {
      record_id: record.record_id,
      timestamp: toJakartaTime(record.timestamp),
      tutor_name: record.tutor_name,
      email: record.email,
      tutoring_date: record.tutoring_date,
      tutoring_time: record.tutoring_time,
      student_name: record.student_name,
      proof_of_teaching: record.proof_of_teaching
    };

    res.status(201).json(transformedRecord);
  } catch (error) {
    console.error('Submit attendance error:', error);
    res.status(500).json({ error: 'Failed to submit attendance' });
  }
};

// Get specific record details
const getRecordDetails = async (req, res) => {
  try {
    const { record_id } = req.params;

    const { data: record, error } = await supabase
      .from('attendance_records')
      .select('*')
      .eq('record_id', record_id)
      .single();

    if (error) {
      console.error('Get record details error:', error);
      return res.status(404).json({ error: 'Record not found' });
    }

    // Transform response to match your format with Jakarta timezone
    const transformedRecord = {
      record_id: record.record_id,
      timestamp: toJakartaTime(record.timestamp),
      tutor_name: record.tutor_name,
      email: record.email,
      tutoring_date: record.tutoring_date,
      tutoring_time: record.tutoring_time,
      student_name: record.student_name,
      proof_of_teaching: record.proof_of_teaching
    };

    res.json(transformedRecord);
  } catch (error) {
    console.error('Get record details error:', error);
    res.status(500).json({ error: 'Failed to fetch record details' });
  }
};

// Update attendance record
const updateAttendanceRecord = async (req, res) => {
  try {
    const { record_id } = req.params;
    const { tutor_name, email, tutoring_date, tutoring_time, student_name, proof_of_teaching } = req.body;

    const updateData = {};
    if (tutor_name) updateData.tutor_name = tutor_name;
    if (email !== undefined) updateData.email = email;
    if (tutoring_date) updateData.tutoring_date = tutoring_date;
    if (tutoring_time) updateData.tutoring_time = tutoring_time;
    if (student_name) updateData.student_name = student_name;
    if (proof_of_teaching !== undefined) updateData.proof_of_teaching = proof_of_teaching;

    updateData.updated_at = new Date().toISOString();

    const { data: record, error } = await supabaseAdmin
      .from('attendance_records')
      .update(updateData)
      .eq('record_id', record_id)
      .select()
      .single();

    if (error) {
      console.error('Update attendance error:', error);
      return res.status(500).json({ error: 'Failed to update attendance' });
    }

    // Transform response to match your format with Jakarta timezone
    const transformedRecord = {
      record_id: record.record_id,
      timestamp: toJakartaTime(record.timestamp),
      tutor_name: record.tutor_name,
      email: record.email,
      tutoring_date: record.tutoring_date,
      tutoring_time: record.tutoring_time,
      student_name: record.student_name,
      proof_of_teaching: record.proof_of_teaching
    };

    res.json(transformedRecord);
  } catch (error) {
    console.error('Update attendance error:', error);
    res.status(500).json({ error: 'Failed to update attendance' });
  }
};

// Delete attendance record
const deleteAttendanceRecord = async (req, res) => {
  try {
    const { record_id } = req.params;

    const { error } = await supabaseAdmin
      .from('attendance_records')
      .delete()
      .eq('record_id', record_id);

    if (error) {
      console.error('Delete attendance error:', error);
      return res.status(500).json({ error: 'Failed to delete attendance' });
    }

    res.json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    console.error('Delete attendance error:', error);
    res.status(500).json({ error: 'Failed to delete attendance' });
  }
};

// Get attendance statistics
const getAttendanceStats = async (req, res) => {
  try {
    const { tutor_name, student_name, start_date, end_date } = req.query;

    let query = supabase
      .from('attendance_records')
      .select('tutoring_date, tutor_name, student_name');

    if (tutor_name) {
      query = query.eq('tutor_name', tutor_name);
    }
    if (student_name) {
      query = query.eq('student_name', student_name);
    }
    if (start_date) {
      query = query.gte('tutoring_date', start_date);
    }
    if (end_date) {
      query = query.lte('tutoring_date', end_date);
    }

    const { data: records, error } = await query;

    if (error) {
      console.error('Get stats error:', error);
      return res.status(500).json({ error: 'Failed to fetch statistics' });
    }

    // Calculate statistics
    const total = records.length;
    const uniqueTutors = [...new Set(records.map(r => r.tutor_name))].length;
    const uniqueStudents = [...new Set(records.map(r => r.student_name))].length;

    res.json({
      total,
      uniqueTutors,
      uniqueStudents,
      averagePerDay: total > 0 ? (total / 30).toFixed(2) : 0 // Assuming 30 days
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};

module.exports = {
  getTutors,
  getStudents,
  getAttendanceRecords,
  submitAttendance,
  getRecordDetails,
  updateAttendanceRecord,
  deleteAttendanceRecord,
  getAttendanceStats
};