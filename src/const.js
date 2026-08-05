const POINT_TYPES = [
  'flight',
  'bus',
  'taxi',
  'restaurant',
  'sightseeing',
  'check-in',
  'train',
  'ship',
  'drive',
];

const MAX_ROUTE_CITIES = 3;

const FLATPICKR_DATE_FORMAT = 'd/m/y H:i';

const FIRST_DAY_OF_WEEK = 1;

const DateFormat = {
  DATE: 'MMM DD',
  TIME: 'HH:mm',
  FULL: 'DD/MM/YY HH:mm',
  TRIP_INFO: 'D MMM',
};
const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  INIT: 'INIT',
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  ERROR: 'ERROR',
};

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export { POINT_TYPES, MAX_ROUTE_CITIES, FLATPICKR_DATE_FORMAT, FIRST_DAY_OF_WEEK, FilterType, SortType, UserAction, UpdateType, TimeLimit, DateFormat };
