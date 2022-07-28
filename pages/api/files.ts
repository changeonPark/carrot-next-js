import { NextApiRequest, NextApiResponse } from "next"
import withHandler from "libs/server/withHandler"
import withApiSession, { ResponseType } from "libs/server/withApiSession"

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const response = await (
    await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ID}/images/v2/direct_upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CF_TOKEN}`,
        },
      }
    )
  ).json()

  res.json({ ok: true, ...response.result })
}

export default withApiSession(withHandler({ methods: ["GET"], handler }))
