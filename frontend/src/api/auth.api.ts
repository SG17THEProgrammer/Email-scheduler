import api from "./axios";

export async function loginWithGoogle(token: string) {
  const res = await api.post("/auth/google", { token });
  return res.data;
}
export async function login(email:string, password:string) {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
}
export async function register( email:string, password:string) {
  const res = await api.post("/auth/register", { email, password});
  return res.data;
}
export async function getUser(email: string) {
  const res = await api.post("/auth/getUser", { email });
  return res.data;
}
