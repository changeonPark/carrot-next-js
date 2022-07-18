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

  const sales = await client.sale.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      product: true,
    },
  })

  if (!sales) {
    res.json({
      ok: false,
      message: "none user",
    })
  }

  res.json({
    ok: true,
    sales,
  })
}

export default withApiSession(withHandler({ methods: ["GET"], handler }))
