import { NextApiRequest, NextApiResponse } from "next"
import withHandler from "libs/server/withHandler"
import client from "libs/server/client"
import withApiSession, { ResponseType } from "libs/server/withApiSession"

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const id = req.session.user?.id
  const profile = await client.user.findUnique({
    where: { id },
  })
  if (!profile) {
    res.json({
      ok: false,
      message: "none user",
    })
  }

  res.json({
    ok: true,
    profile,
  })
}

export default withApiSession(withHandler({ methods: ["GET"], handler }))
