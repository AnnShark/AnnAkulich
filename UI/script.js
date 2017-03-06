
var article1 ={
id:'1',
title:'Лайфхаки для каждого. Как экономить на интернет-покупках',
summary: 'Лайфхаки для каждого. Как экономить на интернет-покупках, не дожидаясь "черной пятницы',
createdAt: new Date (2017,02,26,15,01,0,0),
author:'Ann Akulich',
tags:["лайфхаки","экономить","черная пятница"],
content:'Интернет-шопинг становится все популярнее у белорусов. За прошлый год расходы на онлайн-покупки выросли на четверть. Не выходя из дома белорусы покупают практически все: от косметики и парфюмерии до стройматериалов. Чтобы сделать онлайн-шопинг еще более выгодным, мы подготовили несколько простых советов',
};

var article2 ={
id:'2',
title:'Оскар-2017": лучший фильм — "Лунный свет". "Ла-Ла Ленд" объявили победителем ошибочно',
summary: 'Оскар-2017": лучший фильм — "Лунный свет". "Ла-Ла Ленд"',
createdAt: new Date (2017,02,28,09,0,0,0),
author:'Ann Akulich',
tags:["Оскар","Лунный свет","Ла-Ла Ленд"],
content:'На конфузе в Лос-Анджелесе завершилась 89-я церемония награждения ежегодной премии «Оскар». Лучшим фильмом стал «Лунный свет», приз в номинации «Лучшая актриса» — за Эммой Стоун. Конфуз в том, что сперва академики вскрыли ошибочный конверт с названием «Ла-Ла Ленд»',
};

var article3 ={
id:'3',
title:'"Газпром" повысит стоимость газа для Евросоюза',
summary: '"Газпром" повысит ',
createdAt: new Date (2017,02,27,13,0,0,0),
author:'Ann Akulich',
tags:["Газпром","газ","Евросоюз"],
content:'Экспортная стоимость газа для Евросоюза в текущем году может составить 180−190 долларов за тысячу кубометров. Об этом сообщил заместитель председателя правления «Газпрома» Александр Медведев, передает РИА "Новости".&hellip',
};
var tags = ["лайфхаки","экономить","черная пятница","Оскар","Лунный свет","Ла-Ла Ленд","Газпром","газ","Евросоюз"];

var articles = [article1, article2, article3];
console.log(articles);
var work = articles;
function getArticles(skip,top,FilterConfig)
{
var begin  = skip || 0;
var end = top || 10;
if(FilterConfig.author != undefinded){
var arrayFilterAuthor = work.filter(function(f){
return f.author == FilterConfig.author;
});

}
if(FilterConfig.createdAt != undefinded){
var arrayFilterDate = work.filter(function(f){
return f.createdAt == FilterConfig.createdAt});
}
 if (filterConfig.tags != undefined ) {
            work = work.filter(function (f) {
                return filterConfig.tags.every(function (tag) {
                    return element.tags.indexOf(tag) >= 0;
                });
            });
        }
return work.splice(begin,begin+end);
}
function getArticle(id){
workId = articles;
if(id != undefinded){
var arrayId = workId(function(f){
return f.id == id});
};
return workId;
}
function validateArticle(article){
if(article.id != undefinded ){
return true;
}
else
return false;
if(article.title != undefinded && article.title.length > 0 && article.title.length < 100)
{
return true;
}
else return false;

if( article.summary != undefinded && article.summary.length < 200 ){
return true;
}
else
return false;

if(article.createdAt != undefinded)
{
return true;
}
else return false;

if(article.author != undefinded && article.author.length != 0){
return true;
}
else return false;

if(article.content != undefinded && article.content.length != 0 ){
return true;
}
else return false;
if (article.tags != undefined && !article.tags.every(function (tag) {
            if (tags.indexOf(tag) >= 0) {
                return true;
            } else
                return false;

        }));

}
function addArticle (article){
if(validateArticle(article) == true){
return articles.push(article);
}
return true;

}
function editArticle(id , article){
var index = articles.indexOf(getArticle(editId));
if(validateArticle(article) == true){
if(id == articles[index].id){
articles[index].title = article.title;
articles[index].summary = article.summary;
articles[index].content = article.content;
articles[index].tags = article.tags;
}
}
return true;

}
function removeArticle(id){
 var index = articles.indexOf(getArticle(removeId));
  if (index != -1) {
         articles.splice(index, 1);
         return true;
     }
  }


