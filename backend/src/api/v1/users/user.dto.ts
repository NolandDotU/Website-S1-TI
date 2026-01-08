export interface IUser {
  id: string;
  email: string;
  username: string;
  role: string;
  photo: string | null | undefined;
  authProvider: string;
}
