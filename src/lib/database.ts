import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import type { 
  AppUser, 
  Course, 
  Module, 
  Lesson, 
  Question, 
  StudentProgress 
} from '@/contexts/auth-context';

// User Management
export const getUserById = async (userId: string): Promise<AppUser | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } as AppUser : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const updateUserType = async (userId: string, userType: 'student' | 'teacher' | 'admin'): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      userType,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating user type:', error);
    throw error;
  }
};

// Course Management
export const createCourse = async (courseData: Omit<Course, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'courses'), {
      ...courseData,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

export const getCoursesByTeacher = async (teacherId: string): Promise<Course[]> => {
  try {
    const q = query(
      collection(db, 'courses'),
      where('teacherId', '==', teacherId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
  } catch (error) {
    console.error('Error getting courses by teacher:', error);
    return [];
  }
};

export const getAllCourses = async (): Promise<Course[]> => {
  try {
    const q = query(collection(db, 'courses'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
  } catch (error) {
    console.error('Error getting all courses:', error);
    return [];
  }
};

export const getCourseById = async (courseId: string): Promise<Course | null> => {
  try {
    const courseDoc = await getDoc(doc(db, 'courses', courseId));
    return courseDoc.exists() ? { id: courseDoc.id, ...courseDoc.data() } as Course : null;
  } catch (error) {
    console.error('Error getting course:', error);
    return null;
  }
};

// Module Management
export const createModule = async (moduleData: Omit<Module, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'modules'), {
      ...moduleData,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating module:', error);
    throw error;
  }
};

export const getModulesByCourse = async (courseId: string): Promise<Module[]> => {
  try {
    const q = query(
      collection(db, 'modules'),
      where('courseId', '==', courseId),
      orderBy('orderIndex', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Module));
  } catch (error) {
    console.error('Error getting modules by course:', error);
    return [];
  }
};

// Lesson Management
export const createLesson = async (lessonData: Omit<Lesson, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'lessons'), {
      ...lessonData,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating lesson:', error);
    throw error;
  }
};

export const getLessonsByModule = async (moduleId: string): Promise<Lesson[]> => {
  try {
    const q = query(
      collection(db, 'lessons'),
      where('moduleId', '==', moduleId),
      orderBy('orderIndex', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson));
  } catch (error) {
    console.error('Error getting lessons by module:', error);
    return [];
  }
};

export const getLessonById = async (lessonId: string): Promise<Lesson | null> => {
  try {
    const lessonDoc = await getDoc(doc(db, 'lessons', lessonId));
    return lessonDoc.exists() ? { id: lessonDoc.id, ...lessonDoc.data() } as Lesson : null;
  } catch (error) {
    console.error('Error getting lesson:', error);
    return null;
  }
};

// Question Management
export const createQuestion = async (questionData: Omit<Question, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'questions'), {
      ...questionData,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating question:', error);
    throw error;
  }
};

export const getQuestionsByLesson = async (lessonId: string): Promise<Question[]> => {
  try {
    const q = query(
      collection(db, 'questions'),
      where('lessonId', '==', lessonId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Question));
  } catch (error) {
    console.error('Error getting questions by lesson:', error);
    return [];
  }
};

export const getQuestionsByStudent = async (studentId: string): Promise<Question[]> => {
  try {
    const q = query(
      collection(db, 'questions'),
      where('studentId', '==', studentId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Question));
  } catch (error) {
    console.error('Error getting questions by student:', error);
    return [];
  }
};

// Student Progress Management
export const updateStudentProgress = async (
  studentId: string, 
  lessonId: string, 
  isCompleted: boolean = false
): Promise<void> => {
  try {
    const progressId = `${studentId}_${lessonId}`;
    const progressRef = doc(db, 'studentProgress', progressId);
    const progressDoc = await getDoc(progressRef);

    if (progressDoc.exists()) {
      // Update existing progress
      await updateDoc(progressRef, {
        isCompleted,
        updatedAt: serverTimestamp(),
        lastAccessedAt: serverTimestamp()
      });
    } else {
      // Create new progress record
      await addDoc(collection(db, 'studentProgress'), {
        id: progressId,
        studentId,
        lessonId,
        isCompleted,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastAccessedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error updating student progress:', error);
    throw error;
  }
};

export const getStudentProgress = async (studentId: string, lessonId: string): Promise<StudentProgress | null> => {
  try {
    const progressId = `${studentId}_${lessonId}`;
    const progressDoc = await getDoc(doc(db, 'studentProgress', progressId));
    return progressDoc.exists() ? { id: progressDoc.id, ...progressDoc.data() } as StudentProgress : null;
  } catch (error) {
    console.error('Error getting student progress:', error);
    return null;
  }
};

export const getStudentProgressByCourse = async (studentId: string, courseId: string): Promise<StudentProgress[]> => {
  try {
    // First get all modules for the course
    const modules = await getModulesByCourse(courseId);
    const moduleIds = modules.map(m => m.id);
    
    // Get all lessons for these modules
    const allLessons: Lesson[] = [];
    for (const moduleId of moduleIds) {
      const lessons = await getLessonsByModule(moduleId);
      allLessons.push(...lessons);
    }
    
    // Get progress for all lessons
    const progressPromises = allLessons.map(lesson => 
      getStudentProgress(studentId, lesson.id)
    );
    const progressResults = await Promise.all(progressPromises);
    
    return progressResults.filter(progress => progress !== null) as StudentProgress[];
  } catch (error) {
    console.error('Error getting student progress by course:', error);
    return [];
  }
};

// Analytics and Reporting
export const getCourseStats = async (courseId: string) => {
  try {
    const modules = await getModulesByCourse(courseId);
    const totalModules = modules.length;
    
    let totalLessons = 0;
    for (const module of modules) {
      const lessons = await getLessonsByModule(module.id);
      totalLessons += lessons.length;
    }
    
    // Get enrolled students (students with progress in this course)
    const q = query(collection(db, 'studentProgress'));
    const progressSnapshot = await getDocs(q);
    const enrolledStudents = new Set();
    
    progressSnapshot.docs.forEach(doc => {
      const progress = doc.data() as StudentProgress;
      // Check if this progress belongs to a lesson in this course
      enrolledStudents.add(progress.studentId);
    });
    
    return {
      totalModules,
      totalLessons,
      enrolledStudents: enrolledStudents.size
    };
  } catch (error) {
    console.error('Error getting course stats:', error);
    return { totalModules: 0, totalLessons: 0, enrolledStudents: 0 };
  }
};