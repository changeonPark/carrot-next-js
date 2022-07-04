import { NextApiRequest, NextApiResponse } from "next"
import withHandler from "@libs/server/withHandler"
import client from "@libs/server/client"
import withApiSession, { ResponseType } from "@libs/server/withApiSession"

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const { id } = req.query
  console.log("id", id)
  if (id) {
    const product = await client.product.findUnique({
      where: {
        id: +id.toString(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    })
    console.log("product \n", product)
    res.json({ ok: true, product })
  } else {
    console.log("else")
  }
}

export default withApiSession(withHandler({ methods: ["GET"], handler }))
