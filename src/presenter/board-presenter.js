import EditFormView from '../view/edit-point.js';
import ListView from '../view/list.js';
import PointView from '../view/point.js';
import SortView from '../view/sort.js';
import {render} from '../render.js';

export default class BoardPresenter {
  listComponent = new ListView();

  constructor({ container, pointsModel, destinationsModel, offersModel }) {
    this.container = container;
    this.pointsModel = pointsModel;
    this.destinationsModel = destinationsModel;
    this.offersModel = offersModel;
  }

  init() {
    const points = this.pointsModel.getPoints();
    const firstPoint = points[0];
    const firstDestination = this.destinationsModel.getById(firstPoint.destination);
    const firstCheckedOffers = this.offersModel.getByIds(firstPoint.offers);
    const firstAllOffers = this.offersModel.getByType(firstPoint.type);
    const allDestinations = this.destinationsModel.getDestinations();

    render(new SortView(), this.container);
    render(this.listComponent, this.container);
    render(new EditFormView({
      point: firstPoint,
      destination: firstDestination,
      checkedOffers: firstCheckedOffers,
      allDestinations: allDestinations,
      allOffers: firstAllOffers
    }), this.listComponent.getElement());

    points.forEach((point) => {
      const destination = this.destinationsModel.getById(point.destination);
      const checkedOffers = this.offersModel.getByIds(point.offers);
      const newPoint = new PointView({ point, destination, checkedOffers });
      render(newPoint, this.listComponent.getElement());
    });
  }
}
