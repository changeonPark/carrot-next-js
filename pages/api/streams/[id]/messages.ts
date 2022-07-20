import { NextApiRequest, NextApiResponse } from "next"
import withHandler from "libs/server/withHandler"
import client from "libs/server/client"
import withApiSession, { ResponseType } from "libs/server/withApiSession"

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const {
    query: { id },
    session: { user },
    body: { message },
  } = req

  if (!id || !user || !message) return res.status(404).json({ ok: false })

  const newMessage = await client.message.create({
    data: {
      message,
      stream: {
        connect: {
          id: +id?.toString(),
        },
      },
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  })

  res.json({ ok: true, newMessage })
}

export default withApiSession(withHandler({ methods: ["POST"], handler }))
