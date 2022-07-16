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
  } = req

  if (!id || !user) return res.status(404).json({ ok: false })

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

  const terms = product?.name.split(" ").map(word => ({
    name: {
      contains: word,
    },
  }))

  let relatedProducts = null

  if (terms) {
    relatedProducts = await client.product.findMany({
      where: {
        OR: terms[0],
        AND: {
          id: {
            not: product?.id,
          },
        },
      },
    })
    console.log("relatedProducts: ", relatedProducts)
  }

  const isLiked = Boolean(
    await client.fav.findFirst({
      where: {
        productId: product?.id,
        userId: user.id,
      },
      select: {
        id: true,
      },
    })
  )

  res.json({ ok: true, product, isLiked, relatedProducts })
}

export default withApiSession(withHandler({ methods: ["GET"], handler }))
