const apiKey = '74a5df1124de4fba9dac0f5e85d06f4c';
const defaultSource = 'the-hindu';
//const sourceSelector = document.querySelector('#sources');
const newsArticles = document.querySelector('main');
//serviceWorker
//check if service worker is available in navigator object and then proceed
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () =>
  //onload, check if we can register a service worker
  // To handlethe traffic,the service worker needs tobe in root of the directory, would not work if inside a sub directory
    navigator.serviceWorker.register('sw.js')
    // Success message
      .then(registration => console.log('Service Worker registered'))
      //if not, throw an error
      .catch(err => 'SW registration failed'));
}
//load News
window.addEventListener('load', e => {
    updateNews();
});

//Fetch News and build stream
async function updateNews(source = defaultSource) {
  newsArticles.innerHTML = '';
  const response = await fetch(`https://newsapi.org/v2/top-headlines?sources=${source}&sortBy=top&apiKey=${apiKey}`);
  const json = await response.json();
  newsArticles.innerHTML =
    json.articles.map(createArticle).join('\n');
}

//Create News item scaffolding
function createArticle(article) {
  return `
    <div class="article">
      <a href="${article.url}">
        <h2>${article.title}</h2>
        <img src="${article.urlToImage}" alt="${article.title}">
          </a>
        <p>${article.description}</p>
    </div>
  `;
}
