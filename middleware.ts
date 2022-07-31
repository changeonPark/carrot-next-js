/* eslint-disable @next/next/no-server-import-in-page */
import { NextRequest, userAgent } from "next/server"

export function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith("/chats") ||
    request.nextUrl.pathname.startsWith("/chats/:path*")
  ) {
    console.log("chats Only middleware")
    const url = request.nextUrl
    console.log("url: ", url)
    const user = userAgent(request)
    console.log("device \n", user)
  }

  console.log("it Works at global!")
}
