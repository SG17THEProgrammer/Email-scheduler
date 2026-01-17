export interface Email {
  id: number;
  to_email: string;
  subject: string;
  body: string;
  status: "scheduled" | "sent" | "failed";
  scheduled_at?: string;
  sent_at?: string;
}
