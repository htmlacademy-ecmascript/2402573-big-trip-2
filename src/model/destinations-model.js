import {destinations as destinationsMocks} from '../mock/destinations.js';

export default class DestinationsModel {
  destinations = destinationsMocks;

  getDestinations() {
    return this.destinations;
  }

  getById(id) {
    return this.destinations.find((dest) => dest.id === id);
  }
}
