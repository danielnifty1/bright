import { Router } from "express";
import Appointment from "../../controllers/appointment.controller";
import secure from "../../middlewares/secure";
import authorize from "../../middlewares/authorize";

import { Roles } from "../../types/roles";
const appointmentRouter = Router();
appointmentRouter.get(
  "/get-all",
  secure as any,
  authorize([Roles.SUPER, Roles.ADMIN]),
  Appointment.fetchAppointments
);

appointmentRouter.get(
  "/check-availability",
  secure as any,
  Appointment.checkAppointmentAvailability
);

appointmentRouter.get(
  "/",
  secure as any,
  authorize([ Roles.USER]),
  Appointment.fetchMyAppointments
);

appointmentRouter.post(
  "/",
  secure as any,
  Appointment.createAppointment
);

appointmentRouter.get("/:id", secure as any, Appointment.fetchAppointment);
appointmentRouter.put("/:id", secure as any, authorize([Roles.SUPER, Roles.ADMIN]), Appointment.updateAppointmentTime);
export default appointmentRouter;
  