import successResponse from "../helpers/success_response";
import nodemailer from "../utils/nodeMailer";
import customError from "../helpers/custom_error";
import { Response, Request, NextFunction } from "express";
import { customRequest } from "../interfaces/user_custom_request_body.interface";
import AppointmentEntity from "../model/Appointment";
import { AppointmentInterface } from "../interfaces/appointment.controller.interface";
import endpoint from "../config/endpoints.config";
import { isDuration } from "moment";

class Appointment implements AppointmentInterface {
  constructor(private readonly appointmentEntity: typeof AppointmentEntity) {
    this.createAppointment = this.createAppointment.bind(this);
    this.fetchAppointments = this.fetchAppointments.bind(this);
    this.fetchMyAppointments = this.fetchMyAppointments.bind(this);
    this.fetchAppointment = this.fetchAppointment.bind(this);
    this.updateAppointmentTime = this.updateAppointmentTime.bind(this);
    this.checkAppointmentAvailability =
      this.checkAppointmentAvailability.bind(this);
  }

  public async fetchAppointments(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const appointments = await this.appointmentEntity.find();
      successResponse(
        res,
        appointments,
        200,
        "Appointments fetched successfully"
      );
    } catch (err: any) {
      next(new customError(err.message, 500));
    }
  }
  public async checkAppointmentAvailability(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const appointment = await this.appointmentEntity.find({
        appointment_time: {
          month: { $eq: req.body.month },
          year: { $eq: req.body.year },
        },
      });
      successResponse(
        res,
        appointment,
        200,
        "Appointment fetched successfully"
      );
    } catch (err: any) {
      next(new customError(err.message, 500));
    }
  }
  public async fetchMyAppointments(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const { userId } = req as unknown as customRequest;
    try {
      const appointments = await this.appointmentEntity.find({ user: userId });
      successResponse(
        res,
        appointments,
        200,
        "Appointments fetched successfully"
      );
    } catch (err: any) {
      next(new customError(err.message, 500));
    }
  }
  public async fetchAppointment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const appointment = await this.appointmentEntity.findById(req.params.id);
      successResponse(
        res,
        appointment,
        200,
        "Appointment fetched successfully"
      );
    } catch (err: any) {
      next(new customError(err.message, 500));
    }
  }

  public async createAppointment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const { userId, userData } = req as unknown as customRequest;
    const { title, session_type, duration, appointment_time } = req.body;
    const isValidDuration = duration / 30


    if (
      isValidDuration !== Math.floor(isValidDuration)
    ) {
      next(new customError("Invaid duration. Duration must be multiple of 30's", 400));
    }
    // const isBooked = await this.appointmentEntity.findOne({
    //   appointment_time: {
    //     month: appointment_time.month,
    //     year: appointment_time.year,
    //   },
    // });
    // if (isBooked) {
    //   next(
    //     new customError(
    //       "Selected Appointment slot not available. please choose a different date or  time",
    //       400
    //     )
    //   );
    // }
    try {
      const appointment = await this.appointmentEntity.create({
        user: userId,
        title,
        session_type,
        duration,
        appointment_time,
      });
      await appointment.save();
      //---send booking confirmation---//
      await nodemailer(
        userData.email,
        endpoint.contactAddress,
        `Yey!!!!! your appointment has been processed successfully and below are the details.
       Date:${appointment_time.year - appointment_time.month - appointment_time.day
        }
       Title:${title}
       
       Duration:${duration}.
       Appointment time will be communicated to  you shortly.
       
       `,
        "Appointment booking"
      );
      // ---------------------------------------//
      successResponse(res, appointment, 200, "Appointment created Successfully");
    } catch (err: any) {
      next(new customError(err.message, 500));
    }
  }


  public async updateAppointmentTime(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {

    const { start_time, end_time, month, day, year } = req.body.appointment_time;

    const isBooked = await this.appointmentEntity.findOne({
      appointment_time: {
        month,
        year,
        start_time, end_time,
        day
      },
    });
    if (isBooked) {
      next(
        new customError(
          "Selected Appointment slot not available. please choose a different date or  time",
          400
        )
      );
    }
    try {
      const updatedAppointment = await this.appointmentEntity.findOneAndUpdate({ _id: req.params.id }, { appointment_time: req.body.appointment_time }, { runValidators: true, new: true })

      if (!updatedAppointment) {
        next(
          new customError(
            "Apointment does not exist",
            400
          )
        );
      }
      //---send booking confirmation---//
      await nodemailer(
        req.body.userEmail,
        endpoint.contactAddress,
        `Yey!!!!! your appointment date and time has been set successfully and below are the details.
       Date:${year - month - day
        }
       Title:${updatedAppointment?.title}
       
       Duration:${updatedAppointment?.duration}.
       Appointment time will be communicated to  you shortly.
       
       `,
        "Appointment booking"
      );
      // ---------------------------------------//
      successResponse(res, updatedAppointment, 201, "Appointment updated Successfully");
    } catch (err: any) {
      next(new customError(err.message, 500));
    }
  }

}

export default new Appointment(AppointmentEntity);
