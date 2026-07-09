import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { FilterTypes } from '../const.js';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const isFuturePoint = (point) => dayjs(point.dateFrom).isAfter(dayjs());
const isPastPoint = (point) => dayjs(point.dateTo).isBefore(dayjs());
const isPresentPoint = (point) => dayjs(point.dateFrom).isSameOrBefore(dayjs()) && dayjs(point.dateTo).isSameOrAfter(dayjs());

export const filter = {
  [FilterTypes.EVERYTHING]: (points) => points,
  [FilterTypes.PAST]: (points) => points.filter(isPastPoint),
  [FilterTypes.FUTURE]: (points) => points.filter(isFuturePoint),
  [FilterTypes.PRESENT]: (points) => points.filter(isPresentPoint),
};
