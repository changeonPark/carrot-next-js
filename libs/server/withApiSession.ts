import { withIronSessionApiRoute } from "iron-session/next"
import { NextApiRequest, NextApiResponse } from "next"

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number
    }
  }
}
export type ResponseType = {
  ok: boolean
  [key: string]: any
}

export type HandlerType = (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => Promise<void | NextApiResponse<any>>

const cookieOptions = {
  cookieName: "carrot",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production" ? true : false,
  },
  password: process.env.SESSION_PASSWORD!,
}

const withApiSession = (fn: HandlerType) => {
  return withIronSessionApiRoute(fn, cookieOptions)
}

export default withApiSession
