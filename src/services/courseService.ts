import { getConnection } from '../database/connection';
import { getContract } from '../contracts/CourseContract';
import { Course, Purchase } from '../types/Course';
import { RowDataPacket } from 'mysql2';

export class CourseService {
  private db = getConnection();
  private contract = getContract();

  async syncCourseFromContract(courseId: number): Promise<Course | null> {
    try {
      const courseData = await this.contract.getCourse(courseId);
      
      const course: Course = {
        courseId,
        title: courseData[0],
        description: courseData[1],
        author: courseData[2],
        price: courseData[3].toString(),
        createdAt: Number(courseData[4])
      };

      // Save to database
      await this.saveCourse(course);
      return course;
    } catch (error) {
      console.error('Failed to sync course from contract:', error);
      return null;
    }
  }

  async saveCourse(course: Course): Promise<void> {
    const query = `
      INSERT INTO courses (course_id, title, description, author, price, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        description = VALUES(description),
        author = VALUES(author),
        price = VALUES(price),
        created_at = VALUES(created_at)
    `;

    await this.db.execute(query, [
      course.courseId,
      course.title,
      course.description,
      course.author,
      course.price,
      course.createdAt
    ]);
  }

  async getAllCourses(): Promise<Course[]> {
    const [rows] = await this.db.execute('SELECT * FROM courses ORDER BY created_at DESC');
    return rows as Course[];
  }

  async getCourseById(courseId: number): Promise<Course | null> {
    const [rows] = await this.db.execute(
      'SELECT * FROM courses WHERE course_id = ?',
      [courseId]
    ) as [RowDataPacket[], any];

    if (rows.length === 0) {
      // Try to sync from contract
      return await this.syncCourseFromContract(courseId);
    }

    return rows[0] as Course;
  }

  async getCoursesByAuthor(author: string): Promise<Course[]> {
    const [rows] = await this.db.execute(
      'SELECT * FROM courses WHERE author = ? ORDER BY created_at DESC',
      [author.toLowerCase()]
    );
    return rows as Course[];
  }

  async getUserPurchasedCourses(userAddress: string): Promise<Course[]> {
    try {
      const courseIds = await this.contract.getUserPurchasedCourses(userAddress);
      const courses: Course[] = [];

      for (const courseId of courseIds) {
        const course = await this.getCourseById(Number(courseId));
        if (course) {
          courses.push(course);
        }
      }

      return courses;
    } catch (error) {
      console.error('Failed to get user purchased courses:', error);
      return [];
    }
  }

  async hasUserPurchasedCourse(courseId: number, userAddress: string): Promise<boolean> {
    try {
      return await this.contract.hasUserPurchasedCourse(courseId, userAddress);
    } catch (error) {
      console.error('Failed to check if user purchased course:', error);
      return false;
    }
  }

  async recordPurchase(purchase: Purchase): Promise<void> {
    const query = `
      INSERT INTO purchases (course_id, buyer, price, transaction_hash)
      VALUES (?, ?, ?, ?)
    `;

    await this.db.execute(query, [
      purchase.courseId,
      purchase.buyer.toLowerCase(),
      purchase.price,
      purchase.transactionHash
    ]);
  }

  async getCourseCount(): Promise<number> {
    try {
      const count = await this.contract.getCourseCount();
      return Number(count);
    } catch (error) {
      console.error('Failed to get course count:', error);
      return 0;
    }
  }

  async syncAllCourses(): Promise<void> {
    try {
      const count = await this.getCourseCount();
      
      for (let i = 1; i <= count; i++) {
        await this.syncCourseFromContract(i);
      }
      
      console.log(`Synced ${count} courses from contract`);
    } catch (error) {
      console.error('Failed to sync all courses:', error);
    }
  }
}
