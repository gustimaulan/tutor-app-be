-- Migration: Add student_id foreign key to attendance_records
-- This will create a proper relationship between students and attendance_records

-- Step 1: Add the student_id column
ALTER TABLE attendance_records 
ADD COLUMN student_id UUID REFERENCES students(id);

-- Step 2: Update existing records to link with students table
-- This will match student_name with students.name and set the student_id
UPDATE attendance_records 
SET student_id = students.id 
FROM students 
WHERE attendance_records.student_name = students.name;

-- Step 3: Make student_id NOT NULL after populating it
ALTER TABLE attendance_records 
ALTER COLUMN student_id SET NOT NULL;

-- Step 4: Add index for better performance
CREATE INDEX idx_attendance_student_id ON attendance_records(student_id);

-- Step 5: Add foreign key constraint (this should work since we already have the REFERENCES)
-- The REFERENCES clause in the ADD COLUMN already created the constraint

-- Step 6: Optional: Keep student_name for backward compatibility or remove it
-- For now, we'll keep it but you can remove it later if needed
-- ALTER TABLE attendance_records DROP COLUMN student_name;

-- Step 7: Update the index to include student_id
DROP INDEX IF EXISTS idx_attendance_siswa;
CREATE INDEX idx_attendance_student_name ON attendance_records(student_name);

-- Verify the migration
SELECT 
    ar.record_id,
    ar.student_name,
    ar.student_id,
    s.name as student_table_name,
    s.id as student_table_id
FROM attendance_records ar
LEFT JOIN students s ON ar.student_id = s.id
ORDER BY ar.tutoring_date DESC
LIMIT 10; 