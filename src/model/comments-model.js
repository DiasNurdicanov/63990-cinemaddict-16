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

  getСommentItems = async (id) => {
    try {
      const comments = await this.#apiService.getComments(id);
      this.#commentItems = [...comments];
    } catch(err) {
      this.#commentItems = [];
    }

    this._notify(UpdateType.LOADED_COMMENTS, {commentItems: this.#commentItems});

    return this.#commentItems;
  }

  deleteComment = async (updateType, update, cardId) => {
    const index = this.#commentItems.findIndex((comment) => comment.id === update.id);

    try {
      await this.#apiService.deleteComment(update, cardId);
      this.#commentItems = [
        ...this.#commentItems.slice(0, index),
        ...this.#commentItems.slice(index + 1),
      ];
      this._notify(updateType, {commentItems: this.#commentItems});
    } catch(err) {
      throw new Error('Can\'t delete comment');
    }
  }

  addComment = async (updateType, update, cardId) => {
    try {
      const response = await this.#apiService.addComment(update, cardId);
      this.#commentItems = [...response.comments];
      this._notify(updateType, {commentItems: this.#commentItems, clearForm: true});
    } catch(err) {
      throw new Error('Can\'t add comment');
    }
  }
}
