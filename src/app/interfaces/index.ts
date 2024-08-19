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
  foodUser?: number;
  cleanerUser?: number;
  kid?: boolean;
}

export interface ILevel {
  name?: string;
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
  foodUser?: number;
  cleanerUser?: number;
  privateCode?: number;
  kid?: boolean;
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
  associate = "ROLE_ASSOCIATE",
  base = "ROLE_BASE",
  superAdmin = "ROLE_SUPER_ADMIN",
}

export interface ITask {
  id?: number;
  name?: string;
  userId?: number;
  priority?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  isCompleted?: boolean;
  isVerified?: boolean;
  visible?: boolean;
  recurrent?: string;
  repeatTimes?: number;
}

export interface ITaskie {
  id: number;
  name: string;
  specie: ISpecie;
  status: IStatus;
  user: IUser;
  visible: boolean;
  experience: number;
  life: number;
  cleanse: number;
  hunger: number;
  energy: number;
}
export interface ITaskieSpec {
  name: string;
  specieId: number;
  userId: number;
}
export interface IStatus {
  id: number;
  name: string;
  description: string;
}
export interface ITaskieLevel {
  id?: number;
  name?: string;
  value?: number;
  cosmetic?: ICosmetic;
  hasEvolution?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export interface IInteractable {
  id: number;
  name: string;
  sprite: string;
  hungerEffect: number;
  dirtynessEffect: number;
  lifeEffect: number;
}
export interface ISpecie {
  id: number;
  name: string;
  description: string;
  sprite: string;
  evolution: string;
}

export interface ITaskSpec {
  id?: number;
  name?: string;
  userId?: number;
  priority?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  visible?: boolean;
  recurrent?: string;
  repeatTimes?: number;
}

export interface ICosmetic {
  id?: number;
  name?: string;
  sprite?: string;
  createdAt?: string;
  updatedAt?: string;
}
