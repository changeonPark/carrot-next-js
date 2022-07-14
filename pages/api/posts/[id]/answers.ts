import { NextApiRequest, NextApiResponse } from "next"
import withHandler from "@libs/server/withHandler"
import client from "@libs/server/client"
import withApiSession, { ResponseType } from "@libs/server/withApiSession"

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const {
    query: { id },
    session: { user },
    body: { answer },
  } = req

  if (!id || !user) return

  const post = await client.post.findUnique({
    where: {
      id: +id.toString(),
    },
    select: {
      id: true,
    },
  })
  if (!post)
    return res.status(404).json({ ok: false, message: "Search Not Found." })

  const newAnswer = await client.answer.create({
    data: {
      user: {
        connect: {
          id: user.id,
        },
      },
      post: {
        connect: {
          id: +id.toString(),
        },
      },
      answer,
    },
  })
  console.log(newAnswer)

  res.json({
    ok: true,
  })
}

export default withApiSession(withHandler({ methods: ["POST"], handler }))
