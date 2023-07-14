export interface UserInterface {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  linked: string;
  instagram: string;
  coached: boolean;
  password: string;
  email_verified: boolean;
  getToken: () => Promise<string>;
  comparePassword: (password:string) => Promise<boolean>;
}