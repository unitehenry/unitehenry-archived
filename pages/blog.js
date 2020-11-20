import style from '../styles/Blog.module.css';

export async function getStaticProps() {
  const axios = require('axios');

  function getArticle() {
    return new Promise(async (res) => {
      const req = await axios({
        method: 'GET',
        url: 'https://dev.to/api/articles?username=unitehenry'
      });

      if(req['data']) {
        try {
          const data = req['data'];
          res(data.map((article) => {
            return {
              title: article['title'], 
              description: article['description'], 
              url: article['url'],
              date: article['created_at'],
              image: article['cover_image']
            };
          })); 
        } catch(e) {
          res([]);
        }
      } else {
        res([]);
      }
    }); 
    
  }

  const articles = await getArticle();

  return {
    props: { articles }
  }
}

export default function Blog({ articles }) {
  return (
    <> 
      <main>
        <h1>Developer Blog</h1>
        <hr />
        <a className={style['return-home']} title="Home" href="/">Return Home</a>

        <section>
       
        { (articles.length === 0) && <p>No Blog Posts</p>}

        {
          articles.map(({ title, description, date, url, image }) => {
            return (
              <article key={title} className={style['blog-article']}>
                { image ? <img src={image} /> : null}
                <div className={style['blog-article-content']}>
                  <h2>{ title }</h2>
                  <p>{ description }</p>
                  <a title="Read Article" className={style['blog-button']} href={url} target="_blank">Read Article</a>
                </div>
              </article>
            );
          })
        }
        
        </section>
      
      </main>
    </>
  );
}
