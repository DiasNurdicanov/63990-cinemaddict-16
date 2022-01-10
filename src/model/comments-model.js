import AbstractObservable from '../utils/abstract-observable.js';

export default class CommentsModel extends AbstractObservable {
  #commentItems = [];

  get commentItems() {
    return this.#commentItems;
  }

  set commentItems(commentItems) {
    this.#commentItems = [...commentItems];
  }

  deleteComment(data) {
    console.log(data, this.#commentItems)
    const index = this.#commentItems.findIndex((comment) => comment.id === data.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this.#commentItems = [
      ...this.#commentItems.slice(0, index),
      ...this.#commentItems.slice(index + 1),
    ];
  }

  addComment(newComment) {
    console.log(newComment)
    this.#commentItems = [
      ...this.#commentItems,
      newComment,
    ];
  }
}
