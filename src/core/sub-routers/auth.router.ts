import { Router } from "express";
import Auth from "../../controllers/auth.controller";
import authorize from "../../middlewares/authorize";
import { Roles } from "../../types/roles";

const authRouter = Router();

authRouter.post("/sign-up", Auth.register);
authRouter.post("/verify-email", Auth.verifyEmail);
authRouter.post("/sign-in", Auth.login);
authRouter.post("/admin/sign-in",authorize([Roles.SUPER, Roles.ADMIN]), Auth.login);

export default authRouter;
