let user = JSON.parse(localStorage.getItem('user'));
let newAddArticle = null;
let login = false;
let work;
let articles;
let xhr;
let method;
let url;
let users = [
  {
    username: 'admin',
    password: 'admin',
  },
  {
    username: 'Test',
    password: 'Test',
  },
];

const articlesBlok = (function () {
  let tags;
  function getArticlesFromServer() {
    return new Promise((resolve, reject) => {
      xhr = new XMLHttpRequest();
      method = 'GET';
      url = '/users/articles';
      xhr.open(method, url, true);
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.send();
      xhr.onload = function () {
        articles = JSON.parse(xhr.responseText, (key, value) => {
          if (key === 'createdAt') return new Date(value);
          return value;
        });
        resolve(articles);
        work = articles;
        console.log(articles);
      };
    });
  }

  function getTagsFromServer() {
    return new Promise((resolve, reject) => {
      xhr = new XMLHttpRequest();
      method = 'GET';
      url = '/users/tags';

      xhr.open(method, url, false);
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
          tags = JSON.parse(xhr.responseText);
        }
      };
      xhr.onload = function () {
        getArticlesFromServer();
      };
      xhr.send();
    });
  }


  function updateLocalStorage() {
    localStorage.setItem('articles', JSON.stringify(articles));
  }

  function getUsers() {
    return new Promise((resolve, reject) => {
      xhr.open('GET', '/users/users', true);
      xhr.send();
      xhr.onload = function () {
        if (xhr.status !== 200) {
          reject();
        } else {
          users = JSON.parse(xhr.responseText);
        
          resolve(users);
        }
      };
    });
  }
  
  function pushUser(userInfo) {
    return new Promise((resolve, reject) => {
      console.log(userInfo);

      let xhr = new XMLHttpRequest();
      xhr.open('POST', 'http://localhost:3000/users/postUsers', true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(userInfo));
      xhr.onload = function () {
        console.log('lalalal');
        console.log(xhr.responseText);
        if (!xhr.responseText) return resolve(undefined);
        resolve(JSON.parse(xhr.responseText));
      };
    });
  }

  function getArticles(skip, top, FilterConfig) {
    const begin = skip || 0;
    const end = top || articles.length;
    if (FilterConfig) {
      if (FilterConfig.author) {
        work = articles.filter(f => f.author === FilterConfig.author);
      }

      if (!isNaN(FilterConfig.createdIn) || !isNaN(FilterConfig.createdOut)) {
        work = work.filter(f => FilterConfig.createdIn < f.createdAt && f.createdAt <
         new Date(FilterConfig.createdOut.valueOf() + 24 * 60 * 60 * 1000));
      }
      if (FilterConfig.tags && FilterConfig.tags[0]) {
        work = work.filter(f => f.tags.some(tag => FilterConfig.tags.indexOf(tag) !== -1));
      }
    }
    work.sort((firstArticle, secondArticle) => secondArticle.createdAt.getTime() -
     firstArticle.createdAt.getTime());

    return work.slice(begin, begin + end);
  }

  function getArticle(id) {
    if (id) {
      for (let i = 0; i < articles.length; i++) {
        if (articles[i].id === id) {
          return articles[i];
        }
      }
    }
    return true;
  }

  function getArticlesCount() {
    return work.length;
  }

  function validateArticle(article) {
    if (article.id === undefined) {
      return false;
    } else if (!article.title || typeof (article.title) !== 'string' || article.title.length < 0 || article.title.length > 600) {
      return false;
    } else if (!article.summary || typeof (article.summary) !== 'string' || article.summary.length > 200) {
      return false;
    } else if (!article.createdAt || !(article.createdAt instanceof Date)) {
      return false;
    } else if (!article.author || typeof (article.author) !== 'string' || article.author.length === 0) {
      return false;
    } else if (!article.content || typeof (article.content) !== 'string' || article.content.length === 0) {
      return false;
    } else if (!article.tags) {
      return false;
    }
    console.log(123);
    return true;
  }
  function addArticle(article) {
    return new Promise((resolve, reject) => {
      articles.push(article);
      xhr = new XMLHttpRequest();
      method = 'PUT';
      url = '/users/putArticle';
      xhr.open(method, url, false);
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.send(JSON.stringify(article));
      xhr.onload = function () {
        getArticlesFromServer();
      };
    });
  }


  function editArticle(id, article) {
    return new Promise((resolve, reject) => {
      xhr = new XMLHttpRequest();
      method = 'POST';
      url = '/users/postArticle';
      xhr.open(method, url, false);
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.send(JSON.stringify(article));
      xhr.onload = function () {
        getArticlesFromServer();
      };
    });
  }

  function removeArticle(id) {
    return new Promise((resolve, reject) => {
      xhr = new XMLHttpRequest();
      method = 'DELETE';
      url = '/users/deleteArticle';

      xhr.open(method, url, false);
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
          articles = JSON.parse(xhr.responseText);
          articles.map((x) => {
            x.createdAt = new Date(x.createdAt);
          });
        }
      };
      xhr.send(JSON.stringify({ id }));
      xhr.onload = function () {
        getArticlesFromServer();
      };
    });
  }


  function clearAtriclesFilter() {
    work = articles;
  }

  return {
    getArticles,
    getArticle,
    validateArticle,
    addArticle,
    removeArticle,
    editArticle,
    getArticlesCount,
    clearAtriclesFilter,
    updateLocalStorage,
    getArticlesFromServer,
    pushUser,
    getUsers,
  };
}());

const articlesView = (function () {
  let ARTICLE_TEMPLATE;
  let ARTICLE_LIST;
  let TAGS_TEMPLATE;
  let TAGS_LIST;

  function init() {
    ARTICLE_TEMPLATE = document.querySelector('#article-temp');
    ARTICLE_LIST = document.querySelector('.content');
  }

  function newAddArticles(articles) {
    makeArticles(articles).forEach((article) => {
      ARTICLE_LIST.appendChild(article);
    });
  }

  function makeArticles(articles) {
    articlesBlok.updateLocalStorage();
    return articles.map(article => makeArticle(article));
  }

  function makeArticle(article) {
    ARTICLE_TEMPLATE.content.querySelector('.article').dataset.id = article.id;
    ARTICLE_TEMPLATE.content.querySelector('.title').textContent = article.title;
    ARTICLE_TEMPLATE.content.querySelector('.summary').textContent = article.summary;
    ARTICLE_TEMPLATE.content.querySelector('.author').textContent = article.author;
    ARTICLE_TEMPLATE.content.querySelector('.date').textContent = formatDate(article.createdAt);
    ARTICLE_TEMPLATE.content.querySelector('.editArticleButton').dataset.id = article.id;
    ARTICLE_TEMPLATE.content.querySelector('.deleteArticleButton').dataset.id = article.id;
    TAGS_TEMPLATE = document.querySelector('#tag-temp');
    TAGS_LIST = ARTICLE_TEMPLATE.content.querySelector('.tags');
    const nodeTags = makeTags(article.tags);
    nodeTags.forEach((tag) => {
      TAGS_LIST.appendChild(tag);
    });

    return ARTICLE_TEMPLATE.content.querySelector('.article').cloneNode(true);
  }

  function makeTags(tags) {
    TAGS_LIST.innerHTML = '';
    return tags.map(tag => makeTag(tag));
  }

  function makeTag(tag) {
    TAGS_TEMPLATE.content.querySelector('.tag').textContent = `${tag} `;
    return TAGS_TEMPLATE.content.querySelector('.tag').cloneNode(true);
  }

  function formatDate(date) {
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${
            date.getMinutes()}`;
  }

  function removeArticles() {
    ARTICLE_LIST.innerHTML = '';
  }

  return {
    init,
    removeArticles,
    newAddArticles,
  };
}());

const pagination = (function () {
  let TOTAL;
  const PER_PAGE = 3;
  let CURRENT_PAGE = 1;
  let SHOW_MORE_BUTTON;
  let SHOW_MORE_CALLBACK;


  function init(total, showMoreCb) {
    TOTAL = total;
    SHOW_MORE_CALLBACK = showMoreCb;
    SHOW_MORE_BUTTON = document.getElementsByClassName('paginator')[0];
    SHOW_MORE_BUTTON.addEventListener('click', handleShowMoreClick);


    if (getTotalPages() <= CURRENT_PAGE) {
      hideShowMoreButton();
    } else {
      showMoreButton();
    }

    printPageNumber(CURRENT_PAGE);
    return getParams();
  }

  function handleShowMoreClick() {
    const paginationParams = nextPage();
    SHOW_MORE_CALLBACK(paginationParams.skip, paginationParams.top);
  }

  function getTotalPages() {
    return Math.ceil(TOTAL / PER_PAGE);
  }

  function nextPage() {
    CURRENT_PAGE += 1;
    if (getTotalPages() <= CURRENT_PAGE) {
      hideShowMoreButton();
    }
    printPageNumber(CURRENT_PAGE);
    return getParams();
  }

  function setCurrentPage(pageNum) {
    CURRENT_PAGE = pageNum;
  }

  function printPageNumber(pageNumber) {
    console.debug(`Номер страниц = ${CURRENT_PAGE}`);
    document.querySelector('#page-number').textContent = CURRENT_PAGE;
  }

  function getParams() {
    return {
      top: PER_PAGE,
      skip: (CURRENT_PAGE - 1) * PER_PAGE,
    };
  }

  function hideShowMoreButton() {
    SHOW_MORE_BUTTON.hidden = true;
  }

  function showMoreButton() {
    SHOW_MORE_BUTTON.hidden = false;
  }

  return {
    init,
    setCurrentPage,
  };
}());

function createNewsButton() {
  const col = document.querySelectorAll('.editArticleButton');
  const arr = document.querySelectorAll('.deleteArticleButton').forEach((button) => {
    button.style.visibility = login ? 'visible' : 'hidden';
    button.addEventListener('click', function () {
      articlesBlok.removeArticle(this.getAttribute('data-id'));
      pagination.setCurrentPage(1);
      articlesBlok.clearAtriclesFilter();
      makeArticles(0, 4);
      const total = articlesBlok.getArticlesCount();
      pagination.init(total, makeArticles);
    });
  });

  for (let i = 0; i < col.length; i++) {
    col[i].style.visibility = login ? 'visible' : 'hidden';
    (function (a) {
      col[a].addEventListener('click', function (e) {
        const article = articlesBlok.getArticle((this.getAttribute('data-id')));
        document.querySelector('.edit-form .id').value = article.id;
        document.querySelector('.edit-form .title').value = article.title;
        document.querySelector('.edit-form .author').value = article.author;
        document.querySelector('.edit-form .summary').value = article.summary;
        document.querySelector('.edit-form .tags').value = article.tags;
        document.querySelector('.edit-form .newscontent').value = article.content;
        document.querySelector('.edit-form').style.visibility = 'visible';


        document.querySelector('.edit-form .editOk').addEventListener('click', () => {
          article.id = document.querySelector('.edit-form .id').value;
          article.title = document.querySelector('.edit-form .title').value;
          article.author = document.querySelector('.edit-form .author').value;
          article.summary = document.querySelector('.edit-form .summary').value;
          const arr = document.querySelector('.add-form .tags').value.split(',');
          article.tags = arr;

          article.content = document.querySelector('.edit-form .newscontent').value;
          document.querySelector('.edit-form').style.visibility = 'hidden';
          articlesBlok.editArticle(article.id, article);
          pagination.setCurrentPage(1);
          articlesBlok.clearAtriclesFilter();
          makeArticles(0, 4);
          const total = articlesBlok.getArticlesCount();
          pagination.init(total, makeArticles);
          console.log(articlesBlok.getArticles());
        });
      });
    }(i));
  }
}


document.addEventListener('DOMContentLoaded', startApp);

function startApp() {
  articlesBlok.getArticlesFromServer().then((articles) => {
    articlesView.init();

    const total = articlesBlok.getArticlesCount();
    const paginationParams = pagination.init(total, makeArticles);
    const content = document.getElementsByClassName('content')[0];
    content.addEventListener('click', deligateClickEvent);
    makeArticles(paginationParams.skip, paginationParams.top);
    document.querySelector('.author-name-filter>span>input').addEventListener('input', function () {
      document.querySelector('.authors>li>a').innerHTML = this.value;
    });
    document.querySelector('.tagsFilter>span>input').addEventListener('input', function () {
      document.querySelector('.tagsList>li>a').value = this.value;
    });

    document.querySelector('.login').addEventListener('click', () => {
      document.querySelector('.login-form').style.visibility = 'visible';
    });

    document.querySelector('.login-form .cancel').addEventListener('click', () => {
      document.querySelector('.login-form').style.visibility = 'hidden';
    });
    
    document.querySelector('.login-form .ok').addEventListener('click', () => {
      let user = {};

      user.username = document.querySelector('.login-form .name').value;
      user.password = document.querySelector('.login-form .password').value;

      console.log(user);

      articlesBlok.pushUser(user).then((user) => {
        console.log(user);

        document.querySelector('.user .name').textContent = user.username;
        login = true;

        document.querySelector('.global .add').style.visibility = 'visible';

        createNewsButton();
        document.querySelector('.login-form').style.visibility = 'hidden';
      });
    });
    

    document.querySelector('.add').addEventListener('click', () => {
      document.querySelector('.add-form').style.visibility = 'visible';
    });

    document.querySelector('.add-form .ok').addEventListener('click', () => {
      newAddArticle = {
        title: '',
        author: '',
        createdAt: new Date(),
        summary: '',
        tags: [],
        content: '',
      };
      newAddArticle.id = document.querySelector('.add-form .id').value;
      newAddArticle.title = document.querySelector('.add-form .title').value;
      newAddArticle.author = document.querySelector('.add-form .author').value;

      newAddArticle.createdAt = new Date(Date.now());
      newAddArticle.summary = document.querySelector('.add-form .summary').value;

      const arr = document.querySelector('.add-form .tags').value.split(',');
      newAddArticle.tags = arr;


      newAddArticle.content = document.querySelector('.add-form .newscontent').value;
      articlesBlok.addArticle(newAddArticle);
      pagination.setCurrentPage(1);
      articlesBlok.clearAtriclesFilter();
      makeArticles(0, 4);
      const total = articlesBlok.getArticlesCount();
      pagination.init(total, makeArticles);
      console.log(articlesBlok.getArticles());
      document.querySelector('.add-form').style.visibility = 'hidden';
    });
    document.querySelector('.add-form .cancel').addEventListener('click', () => {
      document.querySelector('.add-form').style.visibility = 'hidden';
    });


    document.querySelector('.edit-form .editCancel').addEventListener('click', () => {
      document.querySelector('.edit-form').style.visibility = 'hidden';
    });

    document.querySelector('.edit-form .editOk').addEventListener('click', () => {
      document.querySelector('.edit-form').style.visibility = 'hidden';
    });
  });
}

function deligateClickEvent(eventObj) {
  const classList = eventObj.target.classList;
  if (eventObj.type === 'click' && classList.contains('button')) {
    readMore(eventObj);
  }
}

function readMore(eventObj) {
  const news = eventObj.target.parentNode;
  const id = news.getAttribute('data-id');
  const article = articlesBlok.getArticle(id);
  news.getElementsByClassName('summary')[0].textContent = article.content;
}

function makeArticles(skip, top, FilterConfig) {
  articlesView.removeArticles();

  articles = articlesBlok.getArticles(skip, top, FilterConfig);

  articlesView.newAddArticles(articles);
  createNewsButton();
}


const countArticlePerPade = 4;

function clearFilterForm() {
  pagination.setCurrentPage(1);
  articlesBlok.clearAtriclesFilter();
  articlesBlok.getArticlesFromServer();
  makeArticles(0, 4);
  const total = articlesBlok.getArticlesCount();
  pagination.init(total, makeArticles);
  document.querySelector('.author-name-filter input').value = '';
  document.querySelector('.tagsFilter input').value = '';
  document.querySelector('.date-filter input.dateIn').value = '';
  document.querySelector('.date-filter input.dateOut').value = '';
}

function filterForm() {
  const form = document.forms['filter-form'];
  const filter = {
    author: form.author.value,
    createdIn: new Date(form.dateIn.value),
    createdOut: new Date(form.dateOut.value),
    tags: form.tags.value.split(' '),
  };


  makeArticles(0, 3, filter);
  const total = articlesBlok.getArticlesCount();
  pagination.setCurrentPage(1);
  const paginationParams = pagination.init(total, makeArticles);
  const content = document.getElementsByClassName('content')[0];
  content.addEventListener('click', deligateClickEvent);
  makeArticles(paginationParams.skip, paginationParams.top, filter);
}
