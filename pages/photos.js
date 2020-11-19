import style from '../styles/Photos.module.css';

export async function getStaticProps() {
  const axios = require('axios');
  const cheerio = require('cheerio');

  function getImages() {
    return new Promise(async (res) => {
      try {
      const req = await axios({
        method: 'GET',
        url: 'https://vsco.co/reidanna/gallery'
      });

      const data = req['data']; 
      const $ = cheerio.load(data);

      $('script').each((i, script) => {
        const content = $(script).html();
        if(content.includes('__PRELOADED_STATE__')) {
          const json = content.substr(content.indexOf('=') + 1);
          const vsco = JSON.parse(json);
          res(Object.values(vsco['entities']['images']));
        }
      });
      } catch(e) {
        res([]);
      }
    });
  }

  const images = await getImages();

  return {
    props: { images }
  }
}

export default function Photos({ images }) {
  
  console.log(images); 
  
  return (
    <main>
      <h1>Photos</h1>
      <hr />
      <a className={style['return-home']} title="Home" href="/">Return Home</a>
      <section className={style['photo-display']}>
      { (images.length === 0) && <p>No Images Found</p>}
      {
        images.map(img => {
          return (
            <a title="View Image" key={img['id']} href={img['shareLink']} target="_blank">
              <img alt={img['description'] || img['id']} src={`https://${img['responsiveUrl']}`} />
            </a>
          );
        })
      }
      </section>
    </main>
  );
}
