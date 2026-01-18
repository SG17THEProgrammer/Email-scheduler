import express from "express";
const cors = require("cors");
import { emailRoutes } from "../modules/email/email.routes";
import { login } from "../modules/auth/login.controller";
import { register } from "../modules/auth/register.controller";
import { googleLogin } from "../modules/auth/googleLogin.controller";
import { getSenderById, getUser } from "../modules/auth/user.controller";
import { getEmailById, getEmails } from "../modules/email/email.controller";

export const app = express();

app.use(
  cors({
    origin:process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/emails", emailRoutes);

app.use("/auth/register",register)
app.use("/auth/login",login)
app.use("/auth/google",googleLogin)
app.use("/emails/getUser",getUser)

app.use("/emails",getEmails)
app.use("/getEmailById",getEmailById)
app.use("/getSenderById",getSenderById)

