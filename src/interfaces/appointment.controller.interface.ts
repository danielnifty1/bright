
import  {Request,Response,NextFunction}  from  "express"
export interface AppointmentInterface {
  fetchAppointment: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<any>;
  fetchAppointments: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<any>;
  checkAppointmentAvailability: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<any>;
  createAppointment: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<any>;
  fetchMyAppointments: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<any>;
}
