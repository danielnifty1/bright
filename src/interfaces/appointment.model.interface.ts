export interface Appointment {
  user:any,
  title: string;
  session_type:any,
  appointment_time: {
    month: String;
    year: String;
    day: String;
    start_time: String;
    end_time: String;
  };
  duration:string,
  status: any;
}
