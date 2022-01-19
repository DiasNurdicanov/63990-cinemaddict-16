import AbstractObservable from '../utils/abstract-observable.js';
import {UpdateType} from '../const.js';

export default class CommentsModel extends AbstractObservable {
  #commentItems = [];
  #apiService = null;

  get commentItems() {
    return this.#commentItems;
  }

  set commentItems(commentItems) {
    this.#commentItems = [...commentItems];
  }

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  getCommentItems = async (id) => {
    try {
      const comments = await this.#apiService.getComments(id);
      this.#commentItems = [...comments];
    } catch(err) {
      this.#commentItems = [];
    }

    this._notify(UpdateType.PATCH, {commentItems: this.#commentItems});

    return this.#commentItems;
  }

  deleteComment = async (update, cardId) => {
    const index = this.#commentItems.findIndex((comment) => comment.id === update.id);

    try {
      await this.#apiService.deleteComment(update, cardId);
      this.#commentItems = [
        ...this.#commentItems.slice(0, index),
        ...this.#commentItems.slice(index + 1),
      ];
    } catch(err) {
      throw new Error('Can\'t delete comment');
    }
  }

  addComment = async (update, cardId) => {
    try {
      const response = await this.#apiService.addComment(update, cardId);
      this.#commentItems = [...response.comments];
    } catch(err) {
      throw new Error('Can\'t add comment');
    }
  }
}
