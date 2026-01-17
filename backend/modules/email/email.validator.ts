import { z } from "zod";
import { ScheduleEmailDTO } from "./email.types";

const schema = z.object({
  senderId: z.number(),
  to: z.string().email(),
  subject: z.string().min(1),
  body: z.string().min(1),

  scheduledAt: z
    .string()
    .datetime({ offset: true })
    .transform((val) => new Date(val)),
});

export function validateSchedule(data: unknown): ScheduleEmailDTO {
  return schema.parse(data);
}
