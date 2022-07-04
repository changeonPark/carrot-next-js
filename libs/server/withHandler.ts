import { NextApiRequest, NextApiResponse } from "next"
import { HandlerType } from "./withApiSession"

type Method = "GET" | "POST" | "DELETE"

type ConfigType = {
  methods: Method[]
  handler: HandlerType
  isPublic?: true
}

const withHandler = ({ methods, handler, isPublic }: ConfigType) => {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method && !methods.includes(req.method as any)) {
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
