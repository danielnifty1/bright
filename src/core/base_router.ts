import { Router } from "express";
import authRouter from "./sub-routers/auth.router";
import userRouter from "./sub-routers/user.router";
import appointmentRouter from "./sub-routers/appointment.router";
const useRouter = Router();
useRouter.use("/auth", authRouter);
useRouter.use("/user", userRouter);
useRouter.use("/appointment", appointmentRouter);

export default useRouter;
