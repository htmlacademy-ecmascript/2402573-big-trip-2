import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { DateFormat } from '../const.js';

dayjs.extend(duration);

const padNumber = (value) => String(value).padStart(2, '0');

const humanizeDate = (date) => date ? dayjs(date).format(DateFormat.DATE).toUpperCase() : '';

const humanizeTime = (time) => time ? dayjs(time).format(DateFormat.TIME) : '';

const humanizeFullDate = (date) => date ? dayjs(date).format(DateFormat.FULL) : '';

const humanizeTripInfoDate = (date) => dayjs(date).format(DateFormat.TRIP_INFO);

const countDuration = (dateTo, dateFrom) => {
  const diff = dayjs.duration(dayjs(dateTo).diff(dayjs(dateFrom)));

  const days = padNumber(Math.floor(diff.asDays()));
  const hours = padNumber(diff.hours());
  const minutes = padNumber(diff.minutes());

  if (diff.asDays() >= 1) {
    return `${days}D ${hours}H ${minutes}M`;
  }
  if (diff.asHours() >= 1) {
    return `${hours}H ${minutes}M`;
  }
  return `${minutes}M`;
};

export {humanizeDate, humanizeTime, humanizeFullDate, humanizeTripInfoDate, countDuration};
