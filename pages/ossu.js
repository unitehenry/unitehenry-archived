import style from '../styles/OSSU.module.css';

export async function getStaticProps() {
  const path = require('path');
  const fs = require('fs');
  const { Converter } = require('showdown');
  const converter = new Converter({ tasklists: true, openLinksInNewWindow: true });

  function parseOSSU() {
    return new Promise((res) => {
      fs.readFile(path.join(process.cwd(), 'OSSU.md'), (err, data) => {
        const ossu = data.toString();
        const html = converter.makeHtml(ossu);
        res(html);
      });
    });
  }

  const html = await parseOSSU();

  return {
    props: { html },
  };

};

export default function ossu({ html }) {
  console.log(html);

  return (
    <main>
      <div className={style['ossu-title']}>
        <h1>OSSU</h1>
        <a href="https://github.com/ossu/computer-science" target="blank">Open Source Society University</a>
      </div>
      <hr />
      <a className={style['return-home']} title="Home" href="/">Return Home</a>
      <section className={style['ossu-page']} dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );

};
