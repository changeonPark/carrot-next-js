import withApiSession, { ResponseType } from "libs/server/withSession"
import withHandler from "libs/server/withHandler"
import { NextApiRequest, NextApiResponse } from "next"
import client from "libs/server/client"

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const {
    query: { id },
    session: { user },
  } = req
  if (!id || !user) return res.status(404).json({ ok: false })

  const alreadyExists = await client.fav.findFirst({
    where: {
      productId: +id,
      userId: user.id,
    },
  })

  if (alreadyExists) {
    //delete
    await client.fav.delete({
      where: {
        id: alreadyExists.id,
      },
    })
  } else {
    // create
    await client.fav.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        product: {
          connect: {
            id: +id,
          },
        },
      },
    })
  }

  res.json({ ok: true })
}

export default withApiSession(withHandler({ methods: ["POST"], handler }))
