import { NextApiRequest, NextApiResponse } from "next"
import withHandler, { Response } from "@libs/server/withHandler"
import client from "@libs/server/client"
import { withIronSessionApiRoute } from "iron-session/next"

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number
    }
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  console.log(req.session.user)
  const id = req.session.user?.id
  const profile = await client.user.findUnique({
    where: { id },
  })

  res.json({
    ok: true,
    profile,
  })
}

export default withIronSessionApiRoute(withHandler("GET", handler), {
  cookieName: "carrot",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production" ? true : false,
  },
  password:
    "1231243253234j1234uioeruawe9r08as-sdfzxcfjkta;rtwerktseiopritdfgjadks",
})
