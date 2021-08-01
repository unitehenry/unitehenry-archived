import style from '../styles/OSSU.module.css';
import { useRef } from 'react';

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

const initContent = (ref) => {

  const progressHeader = ref.querySelector('#progress');

  if(progressHeader) {
    const progress = ref.querySelectorAll('li.task-list-item');

    const completed = [ ...progress ].filter(task => {
      return task.querySelector('input[checked]');
    });
    const total = progress.length;

    const progressBar = document.createElement('div');
    progressBar.classList.add(style['ossu-progress-bar']);

    const progressFill = document.createElement('span');
    progressBar.append(progressFill);

    setTimeout(() => {
      progressFill.style.width = `${(completed.length/progress.length) * 100}%`;
    }, 1000);

    progressHeader.after(progressBar);
  }

};

export default function ossu({ html }) {
  return (
    <main>
      <h1>OSSU</h1>
      <hr />
      <a className={style['return-home']} title="Home" href="/">Return Home</a>
      <section
        className={style['ossu-page']}
        ref={initContent}
        dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );

};
