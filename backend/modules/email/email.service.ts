import { EmailRepository } from "./email.repository";
import { SchedulerService } from "../services/scheduler.service";
import { ScheduleEmailDTO } from "./email.types";

export class EmailService {
  private repo = new EmailRepository();
  private scheduler = new SchedulerService();

  async schedule(data: ScheduleEmailDTO) {
    const email = await this.repo.create(data);
    console.log("Email" , email);
    await this.scheduler.enqueue(email.id, data.scheduledAt);
    return email;
  }
}
