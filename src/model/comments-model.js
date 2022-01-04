import AbstractObservable from '../utils/abstract-observable.js';

export default class CommentsModel extends AbstractObservable {
  #commentItems = [];

  get commentItems() {
    return this.#commentItems;
  }

  set commentItems(commentItems) {
    this.#commentItems = [...commentItems];
  }
}
