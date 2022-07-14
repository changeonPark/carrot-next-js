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
  } = req

  if (!id || !user) return

  const alreadyExists = await client.wondering.findFirst({
    where: {
      userId: user.id,
      postId: +id.toString(),
    },
    select: {
      id: true,
    },
  })

  if (alreadyExists) {
    await client.wondering.delete({
      where: {
        id: alreadyExists.id,
      },
    })
  } else {
    await client.wondering.create({
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
      },
    })
  }

  res.json({
    ok: true,
  })
}

export default withApiSession(withHandler({ methods: ["POST"], handler }))
