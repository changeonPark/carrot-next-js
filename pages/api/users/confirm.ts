import { NextApiRequest, NextApiResponse } from "next"
import withApiSession, { ResponseType } from "libs/server/withSession"
import withHandler from "libs/server/withHandler"
import client from "libs/server/client"

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const { token: payload } = req.body
  console.log("confirm file payload!", payload)
  const token = await client.token.findUnique({
    where: {
      payload,
    },
    include: { user: true },
  })
  console.log("confirm file token", token)
  if (!token) return res.status(404).end()

  req.session.user = {
    id: token.userId,
  }
  await req.session.save()
  await client.token.deleteMany({
    where: {
      userId: token.userId,
    },
  })
  res.json({ ok: true })
}

export default withApiSession(
  withHandler({ methods: ["POST"], handler, isPublic: true })
)
