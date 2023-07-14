import { Router } from "express";
import User from "../../controllers/user.controller";
import secure from "../../middlewares/secure";
import authorize from "../../middlewares/authorize";
import { Roles } from "../../types/roles";

const userRouter = Router();
// make every user route an auth required route
userRouter.use(secure as any);
userRouter.get("/:id", User.fetchUser);
userRouter.get("", authorize([Roles.SUPER, Roles.ADMIN]), User.fetchUsers);
userRouter.get("/profile", User.fetchProfile);
userRouter.put("/update", User.updateProfile);
export default userRouter;
