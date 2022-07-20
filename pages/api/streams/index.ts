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
    body: { name, price, description },
  } = req

  if (req.method === "POST") {
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
    const streams = await client.stream.findMany()
    res.json({ ok: true, streams })
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
)
