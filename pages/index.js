import CONFIG from '../config';
import style from '../styles/Home.module.css';
import { useState } from 'react';
import Head from 'next/head';

export async function getStaticProps() {
  const path = require('path');
  const fs = require('fs');
  const { Converter } = require('showdown');
  const converter = new Converter({ openLinksInNewWindow: true });

  function getPages() {
    return new Promise((res) => {
      fs.readdir(path.join(process.cwd(), 'pages'), (err, data) => {
        const pageFiles = data.filter((f) => {
          return !CONFIG['pageExcludes'].filter((ex) => f.includes(ex)).pop();
        });

        res(pageFiles.map((p) => p.replace('.js', '')));
      });
    });
  }

  function parseREADME() {
    return new Promise((res) => {
      fs.readFile(path.join(process.cwd(), 'README.md'), (err, data) => {
        const readme = data.toString();
        const pReadme = readme.replace(
          new RegExp(`\\(${CONFIG['relativePathReplace']}`, 'g'),
          '(/'
        );
        const html = converter.makeHtml(pReadme);
        res(html);
      });
    });
  }

  const html = await parseREADME();
  const pages = await getPages();

  return {
    props: { html, pages },
  };
}

export default function Home({ html, pages }) {
  const [title, setTitle] = useState(CONFIG['title']);
  const [footerPages, setFooterPages] = useState(false);

  const gatherSocials = (el, socials = []) => {
    const prev = el.previousElementSibling;

    if (prev && prev.tagName === 'P') {
      const social = prev.querySelector('a');
      social && socials.push(social);

      return gatherSocials(prev, socials);
    } else {
      return socials;
    }
  };

  const createSocialLink = (href) => {
    function createIcon(icon, val, title = false) {
      const i = document.createElement('i');
      i.setAttribute('class', `${icon} fa-lg`);

      const lnk = document.createElement('a');
      title && lnk.setAttribute('title', title); 
      
      lnk.setAttribute('class', style['social-link']);
      lnk.setAttribute('href', val);
      lnk.setAttribute('target', 'blank');
      lnk.append(i);

      return lnk;
    }

    const socConf = CONFIG['socials'].filter(({ hrefInclude }) => href.includes(hrefInclude));
    const soc = socConf.pop(); 

    if(soc) {
      return createIcon(soc['icon'], href, soc['title']);
    }
    
  };

  const initContent = (main) => {
    if (main) {
      main.innerHTML = html;

      const header = main.querySelector('h1');
      header && (header.textContent !== title) && setTitle(header.textContent);

      const firstBreak = main.querySelector('hr');
      const socials = gatherSocials(firstBreak);

      const icons = socials.map((soc) => {
        const closest = soc.closest('p');
        const icon = createSocialLink(soc.getAttribute('href'));

        if (icon && closest) {
          closest.remove();
          firstBreak.after(icon);
        }

        return icon;
      });

      if(footerPages === false) {
        setFooterPages([...pages.map(p => ({text: p, href: p})), ...icons.map((soc) => {
          if(soc) {
            return {
              text: soc.getAttribute('title'),
              href: soc.getAttribute('href')
            };
          }
        })]);
      }

    }
  };

  return (
    <div>
      <Head>
        <title> {title} </title>
        <meta name="description" content={CONFIG['description']}></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main ref={initContent} dangerouslySetInnerHTML={{ __html: html }} />

      <footer> 
        <div id="pages">
          { footerPages ? footerPages.map((p) => p ? <a key={p['href']} href={p['href']}>{ p['text'] }</a> : '') : '' }
        </div> 
        {/* <div id="copy">{ '\u00a9' } Henry Unite { new Date().getFullYear() }</div> */}
      </footer>
    </div>
  );
}
