import {destinations as destinationsMocks} from '../mock/destinations.js';

export default class DestinationsModel {
  #destinations = destinationsMocks;

  get destinations() {
    return [...this.#destinations];
  }

  getById(id) {
    return this.#destinations.find((dest) => dest.id === id);
  }
}
