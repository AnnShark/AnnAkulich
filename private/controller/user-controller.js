class UserController {

  constructor() {
    this.User = require('../model/user-model');
  }

  getUserByName(username) {
    return this.User.findOne({ username });
  }
  
}

module.exports = new UserController();
