import { NextApiRequest, NextApiResponse } from "next"

export type Response = {
  ok: boolean
  [key: string]: any
}

type HandlerType = (req: NextApiRequest, res: NextApiResponse) => Promise<void>

const withHandler = (method: "GET" | "POST" | "DELETE", fn: HandlerType) => {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== method) {
      return res.status(405).end()
    }

    try {
      await fn(req, res)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error })
    }
  }
}

export default withHandler
