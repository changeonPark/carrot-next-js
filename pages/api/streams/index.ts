import { NextApiRequest, NextApiResponse } from "next"
import withHandler from "libs/server/withHandler"
import client from "libs/server/client"
import withApiSession, { ResponseType } from "libs/server/withSession"

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  if (req.method === "POST") {
    const {
      session: { user },
      body: { name, price, description },
    } = req

    const stream = await client.stream.create({
      data: {
        name,
        price,
        description,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    })

    res.json({ ok: true, stream })
  }

  if (req.method === "GET") {
    const {
      query: { page },
    } = req
    console.log(page)
    if (!page) return res.status(404).json({ ok: false })

    const streams = await client.stream.findMany({
      take: 5,
      skip: (+page.toString() - 1) * 5,
    })
    res.json({ ok: true, streams })
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
)
