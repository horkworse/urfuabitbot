

declare global{
  namespace Express {
   interface Request {
    user?: IUser
  }
}
}

export interface IUser {
  admin: boolean
  mentor: string
}
