import Document, { Head, Html, Main, NextScript } from "next/document"
import Script from "next/script"

class CustomDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="ko">
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
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
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default CustomDocument
