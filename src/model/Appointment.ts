import { Schema, model } from "mongoose";
import { AppointmentStatus, Session } from "../types/appointment_status";
import { Appointment as AppointmentInterface } from "../interfaces/appointment.model.interface";

const Appointment = new Schema<AppointmentInterface>(

  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Related  user id required"],
    },
    title: {
      type: String,
      trim: true,
      required: [true, "please include an appointment title"],
    },
    session_type: {
      type: String,
      enum: Session,
      default: Session.PHYSICAL,
    },
    duration: {
      type: String,
      required: [true, "please include a session duration"],
    },
    status: {
      type: String,
      enum: AppointmentStatus,
      default: AppointmentStatus.PENDING,
    },
    appointment_time: {
      type: {
        month: String,
        year: String,
        day: String,
        start_time: String,
        end_time: String,
      },
      required: [true, "Please  provide an appointment  time"],
    },
  },

  { timestamps: true }
);
Appointment.pre("save", async function () {
  if (this.duration) {
    
  }
});

export default model("appointment", Appointment);
