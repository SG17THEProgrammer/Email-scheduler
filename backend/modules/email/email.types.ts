export interface User {
  user:{
    id: number;
    name: string;
    email: string;
  }
}

export interface ScheduleEmailDTO {
  senderId: number;
  to: string[];
  subject: string;
  body: string;
  scheduledAt: Date;
  sendAt?: Date;
  emails?:string[];
  user: User;
}
