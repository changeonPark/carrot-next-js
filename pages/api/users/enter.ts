import { NextApiRequest, NextApiResponse } from "next"
import client from "libs/server/client"
import { ResponseType } from "libs/server/withApiSession"
import withHandler from "libs/server/withHandler"
import twilio from "twilio"
import mail from "@sendgrid/mail"

const twilioClient = twilio(process.env.TWILIO_SID!, process.env.TWILIO_TOKEN!)
mail.setApiKey(process.env.SEND_GRID_API_KEY!)

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

  const user = phone ? { phone } : email ? { email } : null
  console.log(user)

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

  if (phone) {
    // const message = await twilioClient.messages.create({
    //   messagingServiceSid: process.env.TWILIO_SERVICE_SID!,
    //   to: process.env.MY_PHONE_NUMBER!,
    //   body: `인증 번호 발송\n ${payload}.`,
    // })
    // console.log("twilio message: \n", message)
  } else if (email) {
    // const email = await mail.send({
    //   from: "cgp@altava.com",
    //   to: "qkrcksrjs@gmail.com",
    //   subject: "Carrot Market Verification Email",
    //   text: `Your token is ${payload}`,
    //   html: `<strong>HTML Token is ${payload}</strong>`,
    // })
  }

  return res.json({
    ok: true,
  })
}

export default withHandler({ methods: ["POST"], handler, isPublic: true })

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
