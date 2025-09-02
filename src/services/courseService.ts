import { getConnection } from '../database/connection';
import { getContract } from '../contracts/CourseContract';
import { Course, Purchase } from '../types/Course';
import { RowDataPacket } from 'mysql2';

export class CourseService {
  private getDb() {
    return getConnection();
  }

  private getContractInstance() {
    return getContract();
  }

  async syncCourseFromContract(courseId: number): Promise<Course | null> {
    try {
      const contract = this.getContractInstance();
      if (!contract) {
        console.warn('Smart contract not available');
        return null;
      }

      const courseData = await contract.getCourse(courseId);
      
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
    const db = this.getDb();
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

    await db.execute(query, [
      course.courseId,
      course.title,
      course.description,
      course.author,
      course.price,
      course.createdAt
    ]);
  }

  async getAllCourses(): Promise<Course[]> {
    const db = this.getDb();
    const [rows] = await db.execute('SELECT * FROM courses ORDER BY created_at DESC');
    return rows as Course[];
  }

  async getCourseById(courseId: number): Promise<Course | null> {
    const db = this.getDb();
    const [rows] = await db.execute(
      'SELECT * FROM courses WHERE course_id = ?',
      [courseId]
    ) as [RowDataPacket[], any];

    if (rows.length === 0) {
      // Try to sync from contract if available
      return await this.syncCourseFromContract(courseId);
    }

    return rows[0] as Course;
  }

  async getCoursesByAuthor(author: string): Promise<Course[]> {
    const db = this.getDb();
    const [rows] = await db.execute(
      'SELECT * FROM courses WHERE author = ? ORDER BY created_at DESC',
      [author.toLowerCase()]
    );
    return rows as Course[];
  }

  async getUserPurchasedCourses(userAddress: string): Promise<Course[]> {
    try {
      const contract = this.getContractInstance();
      if (!contract) {
        console.warn('Smart contract not available, falling back to database');
        return await this.getUserPurchasedCoursesFromDB(userAddress);
      }

      const courseIds = await contract.getUserPurchasedCourses(userAddress);
      const courses: Course[] = [];

      for (const courseId of courseIds) {
        const course = await this.getCourseById(Number(courseId));
        if (course) {
          courses.push(course);
        }
      }

      return courses;
    } catch (error) {
      console.error('Failed to get user purchased courses from contract, falling back to database:', error);
      return await this.getUserPurchasedCoursesFromDB(userAddress);
    }
  }

  private async getUserPurchasedCoursesFromDB(userAddress: string): Promise<Course[]> {
    const db = this.getDb();
    const query = `
      SELECT DISTINCT c.* FROM courses c
      INNER JOIN purchases p ON c.course_id = p.course_id
      WHERE p.buyer = ?
      ORDER BY p.purchased_at DESC
    `;
    
    const [rows] = await db.execute(query, [userAddress.toLowerCase()]);
    return rows as Course[];
  }

  async hasUserPurchasedCourse(courseId: number, userAddress: string): Promise<boolean> {
    try {
      const contract = this.getContractInstance();
      if (!contract) {
        return await this.hasUserPurchasedCourseFromDB(courseId, userAddress);
      }

      return await contract.hasUserPurchasedCourse(courseId, userAddress);
    } catch (error) {
      console.error('Failed to check purchase status from contract, checking database:', error);
      return await this.hasUserPurchasedCourseFromDB(courseId, userAddress);
    }
  }

  private async hasUserPurchasedCourseFromDB(courseId: number, userAddress: string): Promise<boolean> {
    const db = this.getDb();
    const [rows] = await db.execute(
      'SELECT id FROM purchases WHERE course_id = ? AND buyer = ? LIMIT 1',
      [courseId, userAddress.toLowerCase()]
    ) as [RowDataPacket[], any];

    return rows.length > 0;
  }

  async recordPurchase(purchase: Purchase): Promise<void> {
    const db = this.getDb();
    const query = `
      INSERT INTO purchases (course_id, buyer, price, transaction_hash)
      VALUES (?, ?, ?, ?)
    `;

    await db.execute(query, [
      purchase.courseId,
      purchase.buyer.toLowerCase(),
      purchase.price,
      purchase.transactionHash
    ]);
  }

  async getCourseCount(): Promise<number> {
    try {
      const contract = this.getContractInstance();
      if (!contract) {
        // Fall back to database count
        const db = this.getDb();
        const [rows] = await db.execute('SELECT COUNT(*) as count FROM courses') as [RowDataPacket[], any];
        return rows[0].count || 0;
      }

      const count = await contract.getCourseCount();
      return Number(count);
    } catch (error) {
      console.error('Failed to get course count from contract, using database:', error);
      const db = this.getDb();
      const [rows] = await db.execute('SELECT COUNT(*) as count FROM courses') as [RowDataPacket[], any];
      return rows[0].count || 0;
    }
  }

  async syncAllCourses(): Promise<void> {
    try {
      const contract = this.getContractInstance();
      if (!contract) {
        console.warn('Smart contract not available, cannot sync courses');
        return;
      }

      const count = await this.getCourseCount();
      let synced = 0;
      
      for (let i = 1; i <= count; i++) {
        const result = await this.syncCourseFromContract(i);
        if (result) synced++;
      }
      
      console.log(`Synced ${synced}/${count} courses from contract`);
    } catch (error) {
      console.error('Failed to sync all courses:', error);
    }
  }
}