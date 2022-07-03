import { NextApiRequest, NextApiResponse } from "next"
import { HandlerType } from "./withApiSession"

type ConfigType = {
  method: "GET" | "POST" | "DELETE"
  handler: HandlerType
  isPublic?: true
}

const withHandler = ({ method, handler, isPublic }: ConfigType) => {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== method) {
      return res.status(405).end()
    }
    if (!isPublic && !req.session.user) {
      return res.status(401).json({ ok: false, message: "please log in" })
    }

    try {
      await handler(req, res)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error })
    }
  }
}

export default withHandler
