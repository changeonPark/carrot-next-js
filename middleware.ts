import { NextRequest, userAgent, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/_next/static")) {
    // const { isBot } = userAgent(request)
    // if (isBot) {
    //   // https://nextjs.org/docs/messages/returning-response-body-in-middleware
    //   // return new Response("Fucking Bot!, 껒여", { status: 403 })
    // }

    if (!request.nextUrl.pathname.includes("/api")) {
      console.log("pathname: ", request.nextUrl.pathname)
      if (
        !request.cookies.get("carrot") &&
        // !request.nextUrl.pathname.includes("/enter")
        request.nextUrl.pathname !== "/enter"
      ) {
        // return NextResponse.rewrite(new URL("/enter", request.url))
        const loginUrl = new URL("/enter", request.url)
        // loginUrl.searchParams.set("from", request.nextUrl.pathname)
        return NextResponse.redirect(loginUrl)
      }
    }

    if (
      request.nextUrl.pathname.startsWith("/chats") ||
      request.nextUrl.pathname.startsWith("/chats/:path*")
    ) {
      console.log("chats Only middleware")
      const url = request.nextUrl
      console.log("url: ", url)
    }

    console.log("it Works at global!")
  }
}
