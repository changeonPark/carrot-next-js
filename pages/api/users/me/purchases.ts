import { NextApiRequest, NextApiResponse } from "next"
import withHandler from "libs/server/withHandler"
import client from "libs/server/client"
import withApiSession, { ResponseType } from "libs/server/withApiSession"

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
      product: true,
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
