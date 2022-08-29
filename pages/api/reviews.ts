import { NextApiRequest, NextApiResponse } from "next"
import withHandler from "libs/server/withHandler"
import client from "libs/server/client"
import withApiSession, { ResponseType } from "libs/server/withSession"

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const {
    session: { user },
  } = req

  if (!user) {
    return res.json({
      ok: false,
      message: "none user",
    })
  }

  const reviews = await client.review.findMany({
    where: {
      reviewListenerId: user.id,
    },
    include: {
      reviewWriter: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  })

  res.json({
    ok: true,
    reviews,
  })
}

export default withApiSession(withHandler({ methods: ["GET"], handler }))
