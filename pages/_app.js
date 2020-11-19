import CONFIG from '../config';
import '../styles/globals.css'
import Head from 'next/head';

function Portfolio({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>{ CONFIG['title'] }</title> 
        <link href="/fa.min.css" rel="stylesheet"></link> 
        <script src="/fa.min.js"></script>
      </Head> 
      <Component {...pageProps} />
    </>
  );
}

export default Portfolio;
