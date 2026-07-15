import AbstractView from '../framework/view/abstract-view.js';
import { SortTypes } from '../const.js';

function createSortTemplate() {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
            <div class="trip-sort__item  trip-sort__item--${SortTypes.DEFAULT}">
              <input id="sort-${SortTypes.DEFAULT}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${SortTypes.DEFAULT}" checked>
              <label class="trip-sort__btn" for="sort-${SortTypes.DEFAULT}" data-sort-type="${SortTypes.DEFAULT}">${SortTypes.DEFAULT}</label>
            </div>

            <div class="trip-sort__item  trip-sort__item--event">
              <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled>
              <label class="trip-sort__btn" for="sort-event">Event</label>
            </div>

            <div class="trip-sort__item  trip-sort__item--${SortTypes.TIME}">
              <input id="sort-${SortTypes.TIME}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${SortTypes.TIME}">
              <label class="trip-sort__btn" for="sort-${SortTypes.TIME}" data-sort-type="${SortTypes.TIME}">${SortTypes.TIME}</label>
            </div>

            <div class="trip-sort__item  trip-sort__item--${SortTypes.PRICE}">
              <input id="sort-${SortTypes.PRICE}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${SortTypes.PRICE}">
              <label class="trip-sort__btn" for="sort-${SortTypes.PRICE}" data-sort-type="${SortTypes.PRICE}">${SortTypes.PRICE}</label>
            </div>

            <div class="trip-sort__item  trip-sort__item--offer">
              <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" disabled>
              <label class="trip-sort__btn" for="sort-offer">Offers</label>
            </div>
          </form>`
  );
}

export default class SortView extends AbstractView {
  #handleSortTypeChange = null;

  constructor({ onSortTypeChange }) {
    super();
    this.#handleSortTypeChange = onSortTypeChange;

    this.element.addEventListener('click', this.#onSortTypeChange);
  }

  get template() {
    return createSortTemplate();
  }

  #onSortTypeChange = (evt) => {
    if (!evt.target.dataset.sortType) {
      return;
    }
    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };
}
