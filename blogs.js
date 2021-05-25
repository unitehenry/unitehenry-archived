const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

async function getUserArticles(username) {
  const res = await axios({
    method: 'GET',
    url: `https://dev.to/api/articles?username=${username}&state=all`
  });

  return res.data;

}

async function getArticleContent(id) {
  const res = await axios({
    method: 'GET',
    url: `https://dev.to/api/articles/${id}`
  });

  return res.data['body_markdown'];
}

async function generateArticleDocument(title, date, body) {
  return new Promise((resolve) => {
    const name = title.toLowerCase().split(' ').join('-').replace('.', '-');
    const head = `# ${title}\n`;
    const subhead = `${new Date(date).toLocaleDateString()} - Henry Unite\n\n`;
    const content =  head + subhead  + body;
    fs.writeFile(path.join(__dirname, `blogs/${name}.md`), content, () => {
      spawn('mkdir', ['blogs']);
      spawn('cp', ['blog.css', 'blogs']);
      resolve(spawn('pandoc', ['-s', `blogs/${name}.md`, '-c', 'blog.css', '-o', `blogs/${name}.html`]));
    });
  })
}

async function run() {
  const articles = await getUserArticles('unitehenry');
  articles.forEach(async ({ title, id, published_at }) => {
    const body = await getArticleContent(id);
    await generateArticleDocument(title, published_at, body);
  });
  spawn('rm', ['article-temp.md']);
}

run()
