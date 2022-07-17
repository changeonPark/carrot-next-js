import { NextApiRequest, NextApiResponse } from "next"
import withHandler from "libs/server/withHandler"
import client from "libs/server/client"
import withApiSession, { ResponseType } from "libs/server/withApiSession"

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  if (req.method === "POST") {
    const {
      body: { question, latitude, longitude },
      session: { user },
    } = req

    const post = await client.post.create({
      data: {
        question,
        latitude,
        longitude,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    })

    res.json({
      ok: true,
      post,
    })
  }

  if (req.method === "GET") {
    const {
      query: { latitude, longitude },
    } = req

    const parsedLatitude = latitude
      ? parseFloat(latitude.toString())
      : undefined
    const parsedLongitude = longitude
      ? parseFloat(longitude.toString())
      : undefined

    const posts = await client.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            wonderings: true,
            answers: true,
          },
        },
      },
      ...(parsedLatitude &&
        parsedLongitude && {
          where: {
            latitude: {
              gte: parsedLatitude - 0.01,
              lte: parsedLatitude + 0.01,
            },
            longitude: {
              gte: parsedLongitude - 0.01,
              lte: parsedLongitude + 0.01,
            },
          },
        }),
    })

    res.json({
      ok: true,
      posts,
    })
  }
}

export default withApiSession(
  withHandler({ methods: ["POST", "GET"], handler })
)
