'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction(){
    //auto render template file index_index.html
    this.assign({
      title: "ThinkJS 官网",
      author: "thinkjs"
    });
    return this.display();
  }
  
  myAction(){
    //auto render template file index_index.html
    return this.display();
  }
}