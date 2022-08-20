import "styles/globals.css"
import type { AppProps } from "next/app"
import { SWRConfig } from "swr"
import useUser from "libs/client/useUser"
import Script from "next/script"

function MyApp({ Component, pageProps }: AppProps) {
  useUser()

  return (
    <SWRConfig
      value={{
        fetcher: (url: string) => fetch(url).then(response => response.json()),
      }}
    >
      <div className="w-full max-w-xl mx-auto">
        <Component {...pageProps} />
      </div>
      <Script
        src="https://developers.kakao.com/sdk/js/kakao.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://connect.facebook.net/en_US/sdk.js"
        onLoad={() => {
          // @ts-ignore: Unreachable code error
          window.fbAsyncInit = function () {
            // @ts-ignore: Unreachable code error
            FB.init({
              appId: "your-app-id",
              autoLogAppEvents: true,
              xfbml: true,
              version: "v14.0",
            })
          }
        }}
      />
    </SWRConfig>
  )
}

export default MyApp
