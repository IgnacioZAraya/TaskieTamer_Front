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
  role?: IRole;
  level?: ILevel;
  experience?: number;
}

export interface ILevel {
  value?: number;
}

export interface IUserSpec {
  id?: number;
  name?: string;
  lastname?: string;
  email?: string;
  password?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
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

export interface IRole {
  id?: number;
  description?: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}

export enum IRoleType {
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
  visible?: boolean;
}

export interface ITaskie {
  id: number;
  name: string;
  experience: number;
  sprite: string;
  specie: {
    description: string;
  };
  status: {
    description: string;
  };
}
  
export interface ITaskSpec {
  name?: string;
  priority?: number;
  description?: string;
  startDate?: Date;
  endDate?: Date;
}