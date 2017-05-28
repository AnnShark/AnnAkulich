class ArticleController {

  constructor() {
    this.Article = require('../model/article-model');
  }

  getArticles(filter) {
    return this.Article.find(filter).limit(10).sort({ occupation: -1 });
  }

  getArticleById(id) {
    return this.Article.findOne({ id });
  }

  addArticle(article) {
    let model = new this.Article(article);
    return model.save();
  }

  removeArticle(id) {
    return this.Article.remove(id);
  }

  updateArticle(updateArticle) {
    return this.Article.findOneAndUpdate(updateArticle.id, updateArticle, { new: true });
  }
}

module.exports = new ArticleController();
