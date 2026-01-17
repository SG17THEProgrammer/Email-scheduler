import { Router } from "express";
import { scheduleEmail } from "./email.controller";

export const emailRoutes = Router();

emailRoutes.post("/schedule", scheduleEmail);
