import AbstractView from '../framework/view/abstract-view.js';

function createFilterItemTemplate(filterItem, currentFilterType) {
  const {type, count} = filterItem;
  const isDisabled = count === 0 ? 'disabled' : '';
  return (
    `<div class="trip-filters__filter">
      <input id="filter-${type}"
      class="trip-filters__filter-input  visually-hidden"
      type="radio"
      name="trip-filter"
      value="${type}"
      ${isDisabled}
      ${type === currentFilterType ? 'checked' : ''}
      >
        <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
    </div>`
  );
}

function createFilterTemplate(filterItems, filterType) {
  return (
    `<form class="trip-filters" action="#" method="get">
            ${filterItems.map((filter) => createFilterItemTemplate(filter, filterType)).join('')}
         <button class="visually-hidden" type="submit">Accept filter</button>
     </form>`
  );
}

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #filterTypeChangeHandler = null;

  constructor({ filters, currentFilterType, onFilterTypeChange }) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
    this.#filterTypeChangeHandler = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterChangeHandler);
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  #filterChangeHandler = (evt) => {
    evt.preventDefault();
    this.#filterTypeChangeHandler(evt.target.value);
  };
}
