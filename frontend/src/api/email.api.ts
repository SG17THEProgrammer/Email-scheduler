import api from "./axios";

export function scheduleEmail(payload: any) {
  // console.log("payload:", payload);
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

export async function uploadAttachments(files: File[]) {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("attachments", file);
  });

  const { data } = await api.post("/uploadAttachments", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
}

