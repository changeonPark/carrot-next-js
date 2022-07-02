import { NextApiRequest, NextApiResponse } from "next"
import withHandler from "@libs/server/withHandler"
import client from "@libs/server/client"
import withApiSession, { Response } from "@libs/server/withApiSession"

const handler = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  const id = req.session.user?.id
  const profile = await client.user.findUnique({
    where: { id },
  })

  res.json({
    ok: true,
    profile,
  })
}

export default withApiSession(withHandler("GET", handler))
