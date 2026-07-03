import {offers as offersMocks} from './mock/offers.js';
export default class OffersModel {
  offers = offersMocks;

  getOffers() {
    return this.offers;
  }

  getByType(type) {
    const group = this.offers.find((offer) => offer.type === type);
    return group?.offers ?? [];
  }

  getById(id) {
    const flattenOffers = this.offers.flatMap((item) => item.offers);
    return flattenOffers.find((offer) => offer.id === id);
  }

  getByIds(offersIds) {
    return offersIds.map((id) => this.getById(id)).filter(Boolean);
  }
}
