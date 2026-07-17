import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { DATE_AND_TIME_FORMAT, DATE_FORMAT, TIME_FORMAT } from '../const.js';

dayjs.extend(duration);

const padHelper = (num) => String(num).padStart(2, '0');

export const humanizeDate = (date) => date ? dayjs(date).format(DATE_FORMAT).toUpperCase() : '';

export const humanizeTime = (time) => time ? dayjs(time).format(TIME_FORMAT) : '';

export const humanizeFullDate = (date) => date ? dayjs(date).format(DATE_AND_TIME_FORMAT) : '';

export const countDuration = (dateTo, dateFrom) => {
  const diff = dayjs.duration(dayjs(dateTo).diff(dayjs(dateFrom)));

  const days = padHelper(Math.floor(diff.asDays()));
  const hours = padHelper(diff.hours());
  const minutes = padHelper(diff.minutes());

  if (diff.asDays() >= 1) {
    return `${days}D ${hours}H ${minutes}M`;
  }
  if (diff.asHours() >= 1) {
    return `${hours}H ${minutes}M`;
  }
  return `${minutes}M`;
};
