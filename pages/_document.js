import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Removed OpenDyslexic font link, use system fonts instead */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
