export interface ILoginResponse {
  accessToken: string;
  expiresIn: number;
}

export interface IResponse<T> {
  data: T;
}

export interface IUser {
  id?: number;
  name?: string;
  lastname?: string;
  email?: string;
  password?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  authorities?: IAuthority[];
}

export interface IAuthority {
  authority: string;
}

export interface IFeedBackMessage {
  message?: string;
}

export enum IFeedbackStatus {
  success = "SUCCESS",
  error = "ERROR",
  default = "",
}

export enum IRole {
  admin = "ROLE_ADMIN",
  user = "ROLE_USER",
  superAdmin = "ROLE_SUPER_ADMIN",
}

export interface ITaskieImg {
  src: string;
  alt: string;
  title: string;
}

export interface ITask {
  id?: number;
  name?: string;
  userId?: number;
  priority?: number;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  isCompleted?: boolean;
  isVerified?: boolean;
}