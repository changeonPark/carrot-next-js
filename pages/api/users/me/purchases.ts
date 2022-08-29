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

  const purchases = await client.purchase.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      product: {
        include: {
          _count: {
            select: {
              favs: true,
            },
          },
        },
      },
    },
  })

  if (!purchases) {
    res.json({
      ok: false,
      message: "none user",
    })
  }

  res.json({
    ok: true,
    purchases,
  })
}

export default withApiSession(withHandler({ methods: ["GET"], handler }))
