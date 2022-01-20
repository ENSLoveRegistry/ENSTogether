import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charset="utf-8" />
        <meta name="title" content="ENSTogether" />
        <meta
          name="description"
          content="A Love Registry on the Ethereum Blockchain"
        />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link href="/static/favicons/favicon.ico" rel="shortcut icon" />
        <link href="/static/favicons/site.webmanifest" rel="manifest" />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          href="/static/favicons/apple-touch-icon.png"
          rel="apple-touch-icon"
          sizes="180x180"
        />
        <link
          href="/static/favicons/favicon-32x32.png"
          rel="icon"
          sizes="32x32"
          type="image/png"
        />
        <link
          href="/static/favicons/favicon-16x16.png"
          rel="icon"
          sizes="16x16"
          type="image/png"
        />
        <link
          color="#4a9885"
          href="/static/favicons/safari-pinned-tab.svg"
          rel="mask-icon"
        />
        <meta name="twitter:site" content="@enstogether" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:url" content="https://enstogether.xyz" />
        <meta
          property="og:title"
          content="ENSTogether - A Love Registry on the Ethereum Blockchain"
        />
        <meta property="og:image" content="./og.png" />
        <meta
          name="description"
          content="A fun social experience that seeks to extrapolate features of the marriage registry process to web3"
        />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff"></meta>
      </Head>
      <body className="p-0 m-0">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
