const { supabase } = require('../config/supabase');

// Get all students with pagination and filters
const getStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, grade, search } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('students')
      .select('*')
      .order('name');

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    if (grade) {
      query = query.eq('grade', grade);
    }
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    // Get total count
    const { count } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true });

    // Get paginated data
    const { data: students, error } = await query
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Get students error:', error);
      return res.status(500).json({ error: 'Failed to fetch students' });
    }

    res.json({
      students,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

// Get student by ID
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: student, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Get student error:', error);
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
};

// Create new student
const createStudent = async (req, res) => {
  try {
    const { name, grade, status = 'active' } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const { data: student, error } = await supabase
      .from('students')
      .insert([
        {
          name,
          grade,
          status
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Create student error:', error);
      return res.status(500).json({ error: 'Failed to create student' });
    }

    res.status(201).json(student);
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ error: 'Failed to create student' });
  }
};

// Update student
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, grade, status } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (grade !== undefined) updateData.grade = grade;
    if (status) updateData.status = status;

    updateData.updated_at = new Date().toISOString();

    const { data: student, error } = await supabase
      .from('students')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update student error:', error);
      return res.status(500).json({ error: 'Failed to update student' });
    }

    res.json(student);
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ error: 'Failed to update student' });
  }
};

// Delete student
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete student error:', error);
      return res.status(500).json({ error: 'Failed to delete student' });
    }

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
};

// Get student statistics
const getStudentStats = async (req, res) => {
  try {
    const { data: students, error } = await supabase
      .from('students')
      .select('status, grade');

    if (error) {
      console.error('Get student stats error:', error);
      return res.status(500).json({ error: 'Failed to fetch student statistics' });
    }

    // Calculate statistics
    const total = students.length;
    const active = students.filter(s => s.status === 'active').length;
    const inactive = students.filter(s => s.status === 'inactive').length;

    // Group by grade
    const gradeStats = students.reduce((acc, student) => {
      const grade = student.grade || 'Unknown';
      acc[grade] = (acc[grade] || 0) + 1;
      return acc;
    }, {});

    res.json({
      total,
      active,
      inactive,
      activeRate: total > 0 ? (active / total * 100).toFixed(2) : 0,
      gradeStats
    });
  } catch (error) {
    console.error('Get student stats error:', error);
    res.status(500).json({ error: 'Failed to fetch student statistics' });
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentStats
}; 