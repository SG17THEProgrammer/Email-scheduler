import { z } from "zod";
import { ScheduleEmailDTO } from "./email.types";

export function validateSchedule(data: unknown): ScheduleEmailDTO {
  const schema = z.object({
    senderId: z.number(),
    to: z.array(z.string().email()).optional(),
    subject: z.string().min(1),
    body: z.string().min(1),
    emails: z.array(z.string().email()).optional(),
   sendAt: z
    .preprocess((val) => {
      if (typeof val === "string" || val instanceof Date) return new Date(val);
      return new Date(); 
    }, z.date())
    .optional(),

  scheduledAt: z.preprocess((val) => {
    if (typeof val === "string" || val instanceof Date) return new Date(val);
    return new Date(); 
  }, z.date()),
    user: z
      .object({
        user: z
          .object({
            id: z.number(),
            name: z.string().min(1),
            email: z.string().email(),
          })
          .passthrough()
          .optional(),
      })
      .passthrough()
      .optional(),
  });

   const parsed = schema.parse(data);

  return {
    ...parsed,
    sendAt: parsed.sendAt ?? new Date(),
    emails: parsed.emails ?? [],
    user: parsed.user ?? { user: { id: 0, name: '', email: '' } },
    senderId: parsed.senderId ?? parsed.user?.user?.id ?? 0,
  } as ScheduleEmailDTO;
}
