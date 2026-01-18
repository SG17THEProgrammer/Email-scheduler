import api from "./axios";

export function scheduleEmail(payload: any) {
  return api.post("/emails/schedule", payload);
}

export function getScheduledEmails() {
  return api.get("/emails?status=scheduled");
}

export function getSentEmails() {
  return api.get("/emails?status=sent");
}

export function getEmailById(id: string) {
  return api.post(`/getEmailById`, { id });
}

export function getSenderById(id: string) {
  return api.post(`/getSenderById`, { id });
}
