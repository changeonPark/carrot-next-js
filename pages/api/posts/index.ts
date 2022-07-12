import { NextApiRequest, NextApiResponse } from "next"
import withHandler from "@libs/server/withHandler"
import client from "@libs/server/client"
import withApiSession, { ResponseType } from "@libs/server/withApiSession"

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const {
    body: { question },
    session: { user },
  } = req

  const post = await client.post.create({
    data: {
      question,
      user: {
        connect: {
          id: user?.id,
        },
      },
    },
  })

  res.json({
    ok: true,
    post,
  })
}

export default withApiSession(withHandler({ methods: ["POST"], handler }))
