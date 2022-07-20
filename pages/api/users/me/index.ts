import { NextApiRequest, NextApiResponse } from "next"
import withHandler from "libs/server/withHandler"
import client from "libs/server/client"
import withApiSession, { ResponseType } from "libs/server/withApiSession"

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  if (req.method === "GET") {
    const id = req.session.user?.id
    const profile = await client.user.findUnique({
      where: { id },
    })
    if (!profile) {
      res.json({
        ok: false,
        message: "none user",
      })
    }

    res.json({
      ok: true,
      profile,
    })
  }

  if (req.method === "PUT") {
    const {
      session: { user },
      body: { email, phone, name },
    } = req

    const currentUser = await client.user.findUnique({
      where: {
        id: user?.id,
      },
    })
    if (email && email !== currentUser?.email) {
      const alreadyExists = Boolean(
        await client.user.findUnique({
          where: {
            email,
          },
          select: {
            id: true,
          },
        })
      )

      if (alreadyExists) {
        return res.json({
          ok: false,
          error: "Email already used",
        })
      }

      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          email,
        },
      })

      res.json({ ok: true })
    }
    if (phone && phone !== currentUser?.phone) {
      const alreadyExists = Boolean(
        await client.user.findUnique({
          where: {
            phone,
          },
          select: {
            id: true,
          },
        })
      )

      if (alreadyExists) {
        return res.json({
          ok: false,
          error: "Phone number already used",
        })
      }

      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          phone,
        },
      })

      res.json({ ok: true })
    }

    if (name) {
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          name,
        },
      })
    }

    return res.json({ ok: true })
  }
}

export default withApiSession(withHandler({ methods: ["GET", "PUT"], handler }))
