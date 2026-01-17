export interface ScheduleEmailDTO {
  senderId: number;
  to: string;
  subject: string;
  body: string;
  scheduledAt: Date;
}
