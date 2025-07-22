-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set timezone to Asia/Jakarta
SET timezone = 'Asia/Jakarta';

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'user', 'tutor')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    grade VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attendance records table matching your exact structure
CREATE TABLE IF NOT EXISTS attendance_records (
    record_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    tutor_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    tutoring_date DATE NOT NULL,
    tutoring_time TIME NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    proof_of_teaching TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_attendance_tutor ON attendance_records(tutor_name);
CREATE INDEX idx_attendance_siswa ON attendance_records(student_name);
CREATE INDEX idx_attendance_tanggal ON attendance_records(tutoring_date);
CREATE INDEX idx_attendance_email ON attendance_records(email);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_students_name ON students(name);
CREATE INDEX idx_students_status ON students(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_attendance_records_updated_at BEFORE UPDATE ON attendance_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

-- Users policies (allow all operations for now since we're using custom auth)
CREATE POLICY "Allow all users operations" ON users FOR ALL USING (true);

-- Students policies (allow all operations for now since we're using custom auth)
CREATE POLICY "Allow all students operations" ON students FOR ALL USING (true);

-- Attendance records policies (allow all operations for now since we're using custom auth)
CREATE POLICY "Allow all attendance operations" ON attendance_records FOR ALL USING (true);

-- Insert admin user (password: admin123)
INSERT INTO users (email, password, name, role) VALUES 
('admin@example.com', '$2a$12$fLcWYe2u9pm2OpAte.qinuuBb9Yykmpd4cM3pHVGzDGwa3N5qCVG2', 'Admin User', 'admin');

-- Insert sample students data
INSERT INTO students (name, grade, status) VALUES 
('AUFA - AQRA', 'Grade 10', 'active'),
('AALONA', 'Grade 9', 'active'),
('UBAIDILLAH FIDEL MAHARDIKA', 'Grade 11', 'active'),
('RYUGA', 'Grade 8', 'active'),
('INARA SHAFIRA ARDIANA', 'Grade 10', 'active'),
('ALIFIANDRA ZAYAN RAIF', 'Grade 9', 'active'),
('CENCEN', 'Grade 8', 'active'),
('NAVID', 'Grade 11', 'active'),
('M NARENDRA RASYID A', 'Grade 10', 'active'),
('ZAFRENA TISYA', 'Grade 9', 'active');

-- Insert sample attendance data matching your structure
INSERT INTO attendance_records (tutor_name, email, tutoring_date, tutoring_time, student_name, proof_of_teaching) VALUES 
('DZIHNI SHAFA SALSABILA', 'dzihni@example.com', '2025-07-21', '18:30:00', 'AUFA - AQRA', 'https://example.com/bukti1.jpg'),
('ALIYAH HANUN', 'aliyah@example.com', '2025-07-21', '17:00:00', 'AALONA', 'https://example.com/bukti2.jpg'),
('ALIYAH HANUN', 'aliyah@example.com', '2025-07-19', '16:00:00', 'UBAIDILLAH FIDELMAHARDIKA', 'https://example.com/bukti3.jpg'),
('ARIFFINA ERMA R', 'ariffina@example.com', '2025-07-18', '19:00:00', 'RYUGA', 'https://example.com/bukti4.jpg'),
('ARIFFINA ERMA R', 'ariffina@example.com', '2025-07-14', '18:30:00', 'RYUGA', 'https://example.com/bukti5.jpg'); 