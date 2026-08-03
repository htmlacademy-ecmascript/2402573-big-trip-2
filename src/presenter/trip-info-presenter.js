import { render, replace, remove, RenderPosition } from '../framework/render.js';
import { humanizeTripInfoDate } from '../utils/date.js';
import { sortByDay } from '../utils/sort.js';
import TripInfoView from '../view/trip-info-view.js';

export default class TripInfoPresenter {
  #container = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #component = null;

  constructor({ container, pointsModel, destinationsModel, offersModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#pointsModel.addObserver(this.#modelChangeHandler);
  }

  init() {
    this.#renderComponent();
  }

  #renderComponent() {
    const points = [...this.#pointsModel.points].sort(sortByDay);

    if (points.length === 0) {
      remove(this.#component);
      this.#component = null;
      return;
    }

    const prevComponent = this.#component;

    this.#component = new TripInfoView({
      route: this.#calculateRoute(points),
      dates: this.#calculateDates(points),
      totalCost: this.#calculateTotalCost(points),
    });

    if (prevComponent === null) {
      render(this.#component, this.#container, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#component, prevComponent);
    remove(prevComponent);
  }

  #calculateTotalCost(points) {
    return points.reduce((total, point) => {
      const offersPrice = this.#offersModel
        .getByIds(point.offers)
        .reduce((sum, offer) => sum + offer.price, 0);
      return total + point.basePrice + offersPrice;
    }, 0);
  }

  #calculateRoute(points) {
    const cityNames = points.map((point) => this.#destinationsModel.getById(point.destination).name);
    if (cityNames.length <= 3) {
      return cityNames.join(' — ');
    }
    return `${cityNames[0]} ... ${cityNames[cityNames.length - 1]}`;
  }

  #calculateDates(points) {
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    return `${humanizeTripInfoDate(firstPoint.dateFrom)} — ${humanizeTripInfoDate(lastPoint.dateTo)}`;
  }

  #modelChangeHandler = () => {
    this.#renderComponent();
  };
}
