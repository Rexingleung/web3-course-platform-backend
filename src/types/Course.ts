export interface Course {
  id?: number;
  courseId: number;
  title: string;
  description: string;
  author: string;
  price: string;
  createdAt: number;
  updatedAt?: string;
}

export interface Purchase {
  id?: number;
  courseId: number;
  buyer: string;
  price: string;
  transactionHash?: string;
  purchasedAt?: string;
}

export interface CreateCourseRequest {
  title: string;
  description: string;
  price: string;
}

export interface PurchaseCourseRequest {
  courseId: number;
  buyer: string;
  transactionHash: string;
}
