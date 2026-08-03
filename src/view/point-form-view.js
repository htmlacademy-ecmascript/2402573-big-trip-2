import { FIRST_DAY_OF_WEEK, FLATPICKR_DATE_FORMAT, POINT_TYPES } from '../const.js';
import { humanizeFullDate } from '../utils/date.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import he from 'he';

function createTypesTemplate(currentType, id, disabledAttribute) {
  return POINT_TYPES.map((type) => {
    const isCheckedType = currentType === type ? 'checked' : '';
    return (
      `
      <div class="event__type-item">
       <input id="event-type-${type}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${isCheckedType} ${disabledAttribute}>
        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${id}">${type.charAt(0).toUpperCase() + type.slice(1)}</label>
       </div>
      `
    );
  }).join('');
}

function createDestinationsTemplate(allDestinations) {
  return allDestinations
    .map((destination) =>
      `<option value="${he.encode(destination.name)}"></option>`)
    .join('');
}

function createOffersTemplate(allOffers, checkedIds, disabledAttribute) {
  return allOffers
    .map((offer) => {
      const isCheckedOffer = checkedIds.includes(offer.id) ? 'checked' : '';
      return `
         <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-${offer.id}" data-offer-id="${offer.id}" ${isCheckedOffer} ${disabledAttribute}>
           <label class="event__offer-label" for="event-offer-${offer.id}">
           <span class="event__offer-title">${he.encode(offer.title)}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
            </label>
          </div>
        `;
    })
    .join('');
}

function createEditFormTemplate(state, allDestinations, allOffers, isEditMode) {
  const { point, destination, isSaving, isDeleting } = state;
  const { basePrice, dateFrom, dateTo, type, id } = point;
  const offersByType = allOffers.find((offer) => offer.type === type);
  const typeOffers = offersByType?.offers ?? [];
  const disabledAttribute = (isSaving || isDeleting) ? 'disabled' : '';

  return `<li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox" ${disabledAttribute}>

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>
                        ${createTypesTemplate(type, id, disabledAttribute)}
                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-${id}">
                      ${type}
                    </label>
                    <input
                    class="event__input  event__input--destination"
                    id="event-destination-${id}"
                    type="text" name="event-destination"
                    value="${he.encode(destination?.name ?? '')}"
                    list="destination-list-${id}"
                    autocomplete="off"
                    ${disabledAttribute}
                    >
                    <datalist id="destination-list-${id}">
                      ${createDestinationsTemplate(allDestinations)}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-${id}">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time"
                    value="${humanizeFullDate(dateFrom)}"
                    ${disabledAttribute}
                    >
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-${id}">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time"
                    value="${humanizeFullDate(dateTo)}"
                    ${disabledAttribute}
                    >
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-${id}">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input
                    class="event__input  event__input--price"
                    id="event-price-${id}"
                    type="number"
                    min="1"
                    name="event-price"
                    value="${basePrice}"
                    ${disabledAttribute}
                    >
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit">${isSaving ? 'Saving...' : 'Save'}</button>
                    ${isEditMode ?
    `<button class="event__reset-btn" type="reset">${isDeleting ? 'Deleting...' : 'Delete'}</button>` :
    '<button class="event__reset-btn" type="reset">Cancel</button>'}
                    ${isEditMode ? `<button class="event__rollup-btn" type="button" >
                    <span class="visually-hidden">Open event</span>
                  </button>` : ''}
                </header>
                <section class="event__details">
                  ${typeOffers.length ? `<section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                    <div class="event__available-offers">
                     ${createOffersTemplate(typeOffers, point.offers, disabledAttribute)}
                    </div>
                  </section>` : ''}

                  ${destination && (destination.description || (destination.pictures && destination.pictures.length)) ? `<section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${he.encode(destination.description)}</p>
                    ${destination.pictures.length > 0 ? `<div class="event__photos-container">
    <div class="event__photos-tape">
  ${destination.pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${he.encode(picture.description)}">`).join('')}
  </div>` : ''}

                     </div>
                  </section>` : ''}
                </section>
              </form>
            </li>`;
}

export default class PointFormView extends AbstractStatefulView {
  #allOffers = null;
  #allDestinations = null;
  #rollupButtonClickHandler = null;
  #formSubmitHandler = null;
  #deleteButtonClickHandler = null;
  #cancelButtonClickHandler = null;
  #datePickerFrom = null;
  #datePickerTo = null;
  #isEditMode = true;

  constructor({ point, destination, allDestinations, allOffers, isEditMode, onRollupClick, onFormSubmit, onDeleteClick, onCancelClick }) {
    super();
    this._setState({ point, destination, ...this.#setDefaultFlags() });
    this.#allDestinations = allDestinations;
    this.#allOffers = allOffers;
    this.#isEditMode = isEditMode;
    this.#rollupButtonClickHandler = onRollupClick;
    this.#formSubmitHandler = onFormSubmit;
    this.#deleteButtonClickHandler = onDeleteClick;
    this.#cancelButtonClickHandler = onCancelClick;

    this._restoreHandlers();
  }

  get template() {
    return createEditFormTemplate(this._state, this.#allDestinations, this.#allOffers, this.#isEditMode);
  }

  _restoreHandlers() {
    if (this.#isEditMode) {
      this.element
        .querySelector('.event__rollup-btn')
        .addEventListener('click', this.#rollupClickHandler);
    }

    this.element
      .querySelector('.event--edit')
      .addEventListener('submit', this.#pointSubmitHandler);

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

    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#isEditMode ? this.#deleteClickHandler : this.#cancelClickHandler);

    this.element
      .querySelector('.event__input--price')
      .addEventListener('input', this.#priceChangeHandler);

    this.#setDatePickers();
  }

  reset(point, destination) {
    this.updateElement(
      {
        point,
        destination,
        ...this.#setDefaultFlags()
      }
    );
  }

  removeElement() {
    super.removeElement();

    if (this.#datePickerFrom) {
      this.#datePickerFrom.destroy();
      this.#datePickerFrom = null;
    }

    if (this.#datePickerTo) {
      this.#datePickerTo.destroy();
      this.#datePickerTo = null;
    }
  }

  #setDefaultFlags() {
    return { isSaving: false, isDeleting: false };
  }

  #setDatePickers() {
    const [dateFrom, dateTo] = this.element.querySelectorAll('.event__input--time');
    const dateConfig = {
      dateFormat: FLATPICKR_DATE_FORMAT,
      enableTime: true,
      locale: {firstDayOfWeek: FIRST_DAY_OF_WEEK},
      'time_24hr': true
    };

    this.#datePickerFrom = flatpickr(
      dateFrom,
      {
        ...dateConfig,
        defaultDate: this._state.point.dateFrom,
        onClose: this.#dateFromCloseHandler,
        maxDate: this._state.point.dateTo
      }
    );

    this.#datePickerTo = flatpickr(
      dateTo,
      {
        ...dateConfig,
        defaultDate: this._state.point.dateTo,
        onClose: this.#dateToCloseHandler,
        minDate: this._state.point.dateFrom
      }
    );
  }

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#rollupButtonClickHandler();
  };

  #pointSubmitHandler = (evt) => {
    evt.preventDefault();
    if (!this._state.point.destination || !this._state.point.dateFrom || !this._state.point.dateTo) {
      return;
    }

    this.#formSubmitHandler(this._state.point);
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
      point: {...this._state.point, destination: foundDestination.id},
      destination: foundDestination
    });
  };

  #priceChangeHandler = (evt) => {
    const userPrice = parseInt(evt.target.value, 10);
    const price = Number.isNaN(userPrice) ? 0 : userPrice;
    this._setState({
      point: {...this._state.point, basePrice: price}
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

  #dateFromCloseHandler = ([date]) => {
    this._setState({point: {...this._state.point, dateFrom: date}});
    this.#datePickerTo.set('minDate', date);
  };

  #dateToCloseHandler = ([date]) => {
    this._setState({point: {...this._state.point, dateTo: date}});
    this.#datePickerFrom.set('maxDate', date);
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#deleteButtonClickHandler();
  };

  #cancelClickHandler = (evt) => {
    evt.preventDefault();
    this.#cancelButtonClickHandler();
  };
}
