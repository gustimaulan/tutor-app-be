# API Endpoints for n8n Integration

This document lists all available API endpoints for integration with n8n workflows, matching your exact database schema.

## 🔐 Authentication Endpoints

### Register User
- **URL**: `POST /api/auth/register`
- **Description**: Create a new user account
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe",
    "role": "user"
  }
  ```
- **Response**:
  ```json
  {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    },
    "token": "jwt_token_here"
  }
  ```

### Login User
- **URL**: `POST /api/auth/login`
- **Description**: Authenticate user and get JWT token
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    },
    "token": "jwt_token_here"
  }
  ```

### Logout User
- **URL**: `POST /api/auth/logout`
- **Description**: Logout user and clear session
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

### Check Authentication
- **URL**: `GET /api/auth/check`
- **Description**: Verify if user is authenticated
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    }
  }
  ```

## 📊 Data Retrieval Endpoints (Public)

### Get All Tutors
- **URL**: `GET /api/tutors`
- **Description**: Retrieve all unique tutor names from attendance records
- **Query Parameters**: None
- **Response**:
  ```json
  [
    {
      "name": "DZIHNI SHAFA SALSABILA",
      "email": "dzihni@example.com"
    },
    {
      "name": "ALIYAH HANUN",
      "email": "aliyah@example.com"
    }
  ]
  ```

### Get All Students
- **URL**: `GET /api/students`
- **Description**: Retrieve all students with pagination and filters
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Records per page (default: 10)
  - `status` (optional): Filter by status ('active' or 'inactive')
  - `grade` (optional): Filter by grade
  - `search` (optional): Search by student name
- **Response**:
  ```json
  {
    "students": [
      {
        "id": "uuid",
        "name": "AUFA - AQRA",
        "grade": "Grade 10",
        "status": "active",
        "created_at": "2025-07-21T22:32:34.000Z",
        "updated_at": "2025-07-21T22:32:34.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 10,
      "totalPages": 1
    }
  }
  ```

### Get Student Statistics
- **URL**: `GET /api/students/stats`
- **Description**: Get student statistics
- **Query Parameters**: None
- **Response**:
  ```json
  {
    "total": 10,
    "active": 9,
    "inactive": 1,
    "activeRate": "90.00",
    "gradeStats": {
      "Grade 10": 3,
      "Grade 9": 3,
      "Grade 11": 2,
      "Grade 8": 2
    }
  }
  ```

### Get Attendance Records
- **URL**: `GET /api/attendance`
- **Description**: Retrieve attendance records with pagination
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Records per page (default: 10)
  - `nama_tutor` (optional): Filter by tutor name
  - `nama_siswa` (optional): Filter by student name
  - `tanggal` (optional): Filter by specific date (YYYY-MM-DD)
- **Response**:
  ```json
  {
    "records": [
      {
        "record_id": "uuid",
        "timestamp": "2025-07-21T22:32:34.000Z",
        "nama_tutor": "DZIHNI SHAFA SALSABILA",
        "email": "dzihni@example.com",
        "tanggal": "2025-07-21",
        "waktu": "18:30:00",
        "nama_siswa": "AUFA - AQRA",
        "bukti_ajar": "https://example.com/bukti1.jpg"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 9685,
      "totalPages": 969
    }
  }
  ```

### Get Attendance Statistics
- **URL**: `GET /api/stats`
- **Description**: Get attendance statistics
- **Query Parameters**:
  - `tutor_name` (optional): Filter by tutor name
  - `student_name` (optional): Filter by student name
  - `start_date` (optional): Start date for range (YYYY-MM-DD)
  - `end_date` (optional): End date for range (YYYY-MM-DD)
- **Response**:
  ```json
  {
    "total": 9685,
    "uniqueTutors": 45,
    "uniqueStudents": 120,
    "averagePerDay": "322.83"
  }
  ```

## 📝 Attendance Management Endpoints (Protected)

### Submit Attendance Record
- **URL**: `POST /api/attendance`
- **Description**: Create new attendance record
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "nama_tutor": "DZIHNI SHAFA SALSABILA",
    "email": "dzihni@example.com",
    "tanggal": "2025-07-22",
    "waktu": "18:30:00",
    "nama_siswa": "AUFA - AQRA",
    "bukti_ajar": "https://example.com/bukti.jpg"
  }
  ```
- **Response**:
  ```json
  {
    "record_id": "uuid",
    "timestamp": "2025-07-22T10:30:00.000Z",
    "nama_tutor": "DZIHNI SHAFA SALSABILA",
    "email": "dzihni@example.com",
    "tanggal": "2025-07-22",
    "waktu": "18:30:00",
    "nama_siswa": "AUFA - AQRA",
    "bukti_ajar": "https://example.com/bukti.jpg"
  }
  ```

### Get Record Details
- **URL**: `GET /api/records/:record_id`
- **Description**: Get specific attendance record
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Same as attendance record object

### Update Attendance Record
- **URL**: `PATCH /api/attendance/:record_id`
- **Description**: Update existing attendance record
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "nama_tutor": "DZIHNI SHAFA SALSABILA",
    "waktu": "19:00:00",
    "bukti_ajar": "https://example.com/new-bukti.jpg"
  }
  ```
- **Response**: Updated attendance record object

### Delete Attendance Record
- **URL**: `DELETE /api/attendance/:record_id`
- **Description**: Delete attendance record
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "message": "Attendance record deleted successfully"
  }
  ```

## 👨‍🎓 Students Management Endpoints (Protected)

### Get Student by ID
- **URL**: `GET /api/students/:id`
- **Description**: Get specific student details
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "id": "uuid",
    "name": "AUFA - AQRA",
    "grade": "Grade 10",
    "status": "active",
    "created_at": "2025-07-21T22:32:34.000Z",
    "updated_at": "2025-07-21T22:32:34.000Z"
  }
  ```

### Create Student
- **URL**: `POST /api/students`
- **Description**: Create new student
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "name": "New Student",
    "grade": "Grade 11",
    "status": "active"
  }
  ```
- **Response**: Created student object

### Update Student
- **URL**: `PATCH /api/students/:id`
- **Description**: Update existing student
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "grade": "Grade 12",
    "status": "inactive"
  }
  ```
- **Response**: Updated student object

### Delete Student
- **URL**: `DELETE /api/students/:id`
- **Description**: Delete student
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "message": "Student deleted successfully"
  }
  ```

## 📁 File Management Endpoints (Protected)

### Upload Proof File
- **URL**: `POST /api/upload-proof`
- **Description**: Upload proof file for attendance
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `multipart/form-data`
  - `file`: File to upload
  - `record_id`: Attendance record ID
- **Response**:
  ```json
  {
    "message": "File uploaded successfully",
    "proof_url": "https://example.com/file.jpg",
    "file_name": "attendance-proofs/uuid/timestamp-filename.jpg"
  }
  ```

### Get File URL
- **URL**: `GET /api/file/:file_name`
- **Description**: Get public URL for file
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "url": "https://example.com/file.jpg"
  }
  ```

### Delete File
- **URL**: `DELETE /api/file/:file_name`
- **Description**: Delete file from storage
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "message": "File deleted successfully"
  }
  ```

## 🏥 Health Check

### Server Health
- **URL**: `GET /health`
- **Description**: Check server status
- **Response**:
  ```json
  {
    "status": "OK",
    "timestamp": "2025-07-22T06:02:30.202Z",
    "environment": "development"
  }
  ```

## 🔧 n8n Integration Examples

### Authentication Flow
1. Use **HTTP Request** node to login
2. Extract JWT token from response
3. Use token in subsequent requests

### Webhook Triggers
- Set up webhooks for attendance submissions
- Use **Webhook** node to receive real-time data
- Process attendance records automatically

### Scheduled Workflows
- Use **Cron** node to fetch daily attendance
- Generate reports automatically
- Send notifications for missing attendance

### Data Processing
- Use **Set** node to format data
- Use **Function** node for custom logic
- Use **HTTP Request** node to update records

### Migration from Google Sheets
- Use **Google Sheets** node to read existing data
- Use **HTTP Request** node to insert into Supabase
- Transform data format using **Set** node

## 📋 Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "message": "Detailed error description (development only)"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error

## 🔄 Database Schema

Your attendance records table structure:

```sql
CREATE TABLE attendance_records (
    record_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    nama_tutor VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    tanggal DATE NOT NULL,
    waktu TIME NOT NULL,
    nama_siswa VARCHAR(255) NOT NULL,
    bukti_ajar TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Field Descriptions:**
- `record_id`: Unique identifier for each record
- `timestamp`: When the record was created
- `nama_tutor`: Tutor's name
- `email`: Tutor's email (optional)
- `tanggal`: Date of the lesson
- `waktu`: Time of the lesson
- `nama_siswa`: Student's name
- `bukti_ajar`: URL or path to teaching proof file (optional) 