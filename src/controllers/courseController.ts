import { Request, Response } from 'express';
import { CourseService } from '../services/courseService';
import { PurchaseCourseRequest } from '../types/Course';

const courseService = new CourseService();

export const getCourses = async (req: Request, res: Response) => {
  try {
    const courses = await courseService.getAllCourses();
    res.json({ success: true, data: courses });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch courses' });
  }
};

export const getCourse = async (req: Request, res: Response) => {
  try {
    const courseId = parseInt(req.params.id);
    if (isNaN(courseId)) {
      return res.status(400).json({ success: false, error: 'Invalid course ID' });
    }

    const course = await courseService.getCourseById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    res.json({ success: true, data: course });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch course' });
  }
};

export const getCoursesByAuthor = async (req: Request, res: Response) => {
  try {
    const { author } = req.params;
    if (!author) {
      return res.status(400).json({ success: false, error: 'Author address is required' });
    }

    const courses = await courseService.getCoursesByAuthor(author);
    res.json({ success: true, data: courses });
  } catch (error) {
    console.error('Get courses by author error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch courses' });
  }
};

export const getUserPurchasedCourses = async (req: Request, res: Response) => {
  try {
    const { userAddress } = req.params;
    if (!userAddress) {
      return res.status(400).json({ success: false, error: 'User address is required' });
    }

    const courses = await courseService.getUserPurchasedCourses(userAddress);
    res.json({ success: true, data: courses });
  } catch (error) {
    console.error('Get user purchased courses error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch purchased courses' });
  }
};

export const checkPurchaseStatus = async (req: Request, res: Response) => {
  try {
    const courseId = parseInt(req.params.courseId);
    const { userAddress } = req.params;
    
    if (isNaN(courseId) || !userAddress) {
      return res.status(400).json({ success: false, error: 'Invalid parameters' });
    }

    const hasPurchased = await courseService.hasUserPurchasedCourse(courseId, userAddress);
    res.json({ success: true, data: { hasPurchased } });
  } catch (error) {
    console.error('Check purchase status error:', error);
    res.status(500).json({ success: false, error: 'Failed to check purchase status' });
  }
};

export const recordPurchase = async (req: Request, res: Response) => {
  try {
    const { courseId, buyer, transactionHash, price } = req.body as PurchaseCourseRequest & { price: string };
    
    if (!courseId || !buyer || !transactionHash || !price) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    await courseService.recordPurchase({
      courseId,
      buyer,
      price,
      transactionHash
    });

    res.json({ success: true, message: 'Purchase recorded successfully' });
  } catch (error) {
    console.error('Record purchase error:', error);
    res.status(500).json({ success: false, error: 'Failed to record purchase' });
  }
};

export const syncCourses = async (req: Request, res: Response) => {
  try {
    await courseService.syncAllCourses();
    res.json({ success: true, message: 'Courses synced successfully' });
  } catch (error) {
    console.error('Sync courses error:', error);
    res.status(500).json({ success: false, error: 'Failed to sync courses' });
  }
};

export const getCourseCount = async (req: Request, res: Response) => {
  try {
    const count = await courseService.getCourseCount();
    res.json({ success: true, data: { count } });
  } catch (error) {
    console.error('Get course count error:', error);
    res.status(500).json({ success: false, error: 'Failed to get course count' });
  }
};