import { Router } from 'express';
import {
  getCourses,
  getCourse,
  getCoursesByAuthor,
  getUserPurchasedCourses,
  checkPurchaseStatus,
  recordPurchase,
  syncCourses,
  getCourseCount
} from '../controllers/courseController';

const router = Router();

// Get all courses
router.get('/', getCourses);

// Get course count from contract
router.get('/count', getCourseCount);

// Sync courses from contract
router.post('/sync', syncCourses);

// Get courses by author
router.get('/author/:author', getCoursesByAuthor);

// Get user purchased courses
router.get('/purchased/:userAddress', getUserPurchasedCourses);

// Check if user has purchased a course
router.get('/purchased/:courseId/:userAddress', checkPurchaseStatus);

// Record a purchase
router.post('/purchase', recordPurchase);

// Get specific course
router.get('/:id', getCourse);

export default router;
