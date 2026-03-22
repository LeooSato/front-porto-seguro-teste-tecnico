export interface Course {
  id: string;
  name: string;
  description: string;
}

export interface CoursePayload {
  name: string;
  description: string;
}

export interface EnrollmentRequest {
  courseId: string;
}
