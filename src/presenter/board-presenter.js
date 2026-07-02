import EditFormView from '../view/edit-point.js';
import ListView from '../view/list.js';
import PointView from '../view/point.js';
import SortView from '../view/sort.js';
import {render} from '../render.js';

export default class BoardPresenter {
  listComponent = new ListView();

  constructor({ container }) {
    this.container = container;
  }

  init() {
    render(new SortView(), this.container);
    render(this.listComponent, this.container);
    render(new EditFormView(), this.listComponent.getElement());

    for (let i = 0; i < 3; i += 1) {
      render(new PointView(), this.listComponent.getElement());
    }
  }
}
