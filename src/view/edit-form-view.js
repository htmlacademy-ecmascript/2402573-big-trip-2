import {POINT_TYPES} from '../const.js';
import { humanizeFullDate } from '../utils/date.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

function createTypesTemplate(currentType, id) {
  return POINT_TYPES.map((type) => {
    const isCheckedType = currentType === type ? 'checked' : '';
    return (
      `
      <div class="event__type-item">
       <input id="event-type-${type}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${isCheckedType}>
        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${id}">${type.charAt(0).toUpperCase() + type.slice(1)}</label>
       </div>
      `
    );
  }).join('');
}

function createDestinationsTemplate(allDestinations) {
  return allDestinations
    .map((destination) =>
      `<option value="${destination.name}"></option>`)
    .join('');
}

function createOffersTemplate(allOffers, checkedIds) {
  return allOffers
    .map((offer) => {
      const isCheckedOffer = checkedIds.includes(offer.id) ? 'checked' : '';
      return `
         <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-${offer.id}" data-offer-id="${offer.id}" ${isCheckedOffer}>
           <label class="event__offer-label" for="event-offer-${offer.id}">
           <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
            </label>
          </div>
        `;
    })
    .join('');
}

function createEditFormTemplate(point, destination, allDestinations, allOffers) {
  const { basePrice, dateFrom, dateTo, type, id } = point;
  const offersByType = allOffers.find((offer) => offer.type === type);
  const typeOffers = offersByType?.offers ?? [];

  return `<li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>
                        ${createTypesTemplate(type, id)}
                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-${id}">
                      ${type}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${destination.name}" list="destination-list-${id}">
                    <datalist id="destination-list-${id}">
                      ${createDestinationsTemplate(allDestinations)}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-${id}">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${humanizeFullDate(dateFrom)}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-${id}">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${humanizeFullDate(dateTo)}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-${id}">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${basePrice}">
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">Delete</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">
                  <section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                    <div class="event__available-offers">
                     ${createOffersTemplate(typeOffers, point.offers)}
                    </div>
                  </section>

                  <section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${destination.description}</p>
                    <div class="event__photos-container">
                      <div class="event__photos-tape">
                        ${destination.pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('')}
                      </div>
                     </div>
                  </section>
                </section>
              </form>
            </li>`;
}

export default class EditFormView extends AbstractStatefulView {
  #allOffers = null;
  #allDestinations = null;
  #onRollupClick = null;
  #onFormSubmit = null;

  constructor({ point, destination, allDestinations, allOffers, onRollupClick, onFormSubmit }) {
    super();
    this._setState({ point, destination });
    this.#allDestinations = allDestinations;
    this.#allOffers = allOffers;
    this.#onRollupClick = onRollupClick;
    this.#onFormSubmit = onFormSubmit;

    this._restoreHandlers();
  }

  get template() {
    return createEditFormTemplate(this._state.point, this._state.destination, this.#allDestinations, this.#allOffers);
  }

  _restoreHandlers() {
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#rollupClickHandler);

    this.element
      .querySelector('.event--edit')
      .addEventListener('submit', this.#formSubmitHandler);

    this.element
      .querySelector('.event__type-group')
      .addEventListener('change', this.#typeChangeHandler);

    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);

    const offersWrapper = this.element.querySelector('.event__available-offers');
    if (offersWrapper) {
      offersWrapper.addEventListener('change', this.#offersChangeHandler);
    }
  }

  reset(point, destination) {
    this.updateElement(
      {
        point,
        destination
      }
    );
  }

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#onRollupClick();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#onFormSubmit(this._state.point);
  };

  #typeChangeHandler = (evt) => {
    this.updateElement({
      point: {...this._state.point, type: evt.target.value, offers: [] },
    });
  };

  #destinationChangeHandler = (evt) => {
    const foundDestination = this.#allDestinations.find((destination) => destination.name === evt.target.value);
    if (!foundDestination) {
      return;
    }
    this.updateElement({
      destination: foundDestination
    });
  };

  #offersChangeHandler = (evt) => {
    if (!evt.target.dataset.offerId) {
      return;
    }

    const checkedOffer = evt.target.dataset.offerId;
    const isChecked = evt.target.checked;
    let checkedOffers = [...this._state.point.offers];

    if (isChecked) {
      checkedOffers.push(checkedOffer);
    } else {
      checkedOffers = checkedOffers.filter((id) => id !== checkedOffer);
    }

    this.updateElement({
      point: {...this._state.point, offers: checkedOffers}
    });
  };

}
