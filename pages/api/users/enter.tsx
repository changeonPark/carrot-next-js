import { NextApiRequest, NextApiResponse } from "next"
import client from "@libs/server/client"
import withHandler, { ResponseType } from "@libs/server/withHandler"
import twilio from "twilio"

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)

/*
  -> phone # -> User?
  -> Token---User  #RandomNum
  -> #RandomNum -> SMS -> phone # (Twilio)
  -> #RandomNum -> Token?---User -> Log the user Info
*/

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const { email, phone } = req.body

  const user = phone ? { phone: +phone } : email ? { email } : null
  if (!user) return res.status(400).json({ ok: false })
  const payload = Math.floor(100000 + Math.random() * 900000) + ""
  const token = await client.token.create({
    data: {
      payload,
      user: {
        connectOrCreate: {
          where: {
            ...user,
          },
          create: {
            name: "Anonymous",
            ...user,
          },
        },
      },
    },
  })
  console.log(token)

  return res.json({
    ok: true,
  })
}

export default withHandler("POST", handler)

// const user = await client.user.upsert({
//   where: {
//     ...payload,
//   },
//   create: {
//     name: "Anonymous",
//     ...payload,
//   },
//   update: {
//     name: "UpdatedName",
//     ...payload,
//   },
// })

// if (email) {
//   user = await client.user.findUnique({
//     where: {
//       email,
//     },
//   })

//   if (!user) {
//     console.log("not found. creating...")
//     user = await client.user.create({
//       data: {
//         name: "Anonymous",
//         email,
//       },
//     })
//   }
//   console.log(user)
// }

// if (phone) {
//   user = await client.user.findUnique({
//     where: {
//       phone: +phone,
//     },
//   })

//   if (!user) {
//     console.log("not found. creating...")
//     user = await client.user.create({
//       data: {
//         name: "Anonymous",
//         phone: +phone,
//       },
//     })
//   }
//   console.log(user)
// }
