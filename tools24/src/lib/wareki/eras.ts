export interface Era {
  name: string;
  nameShort: string;
  startDate: string; // YYYY-MM-DD
  endDate: string | null; // null = ongoing
}

export const ERAS: Era[] = [
  { name: '令和', nameShort: 'R', startDate: '2019-05-01', endDate: null },
  { name: '平成', nameShort: 'H', startDate: '1989-01-08', endDate: '2019-04-30' },
  { name: '昭和', nameShort: 'S', startDate: '1926-12-25', endDate: '1989-01-07' },
  { name: '大正', nameShort: 'T', startDate: '1912-07-30', endDate: '1926-12-24' },
  { name: '明治', nameShort: 'M', startDate: '1868-01-25', endDate: '1912-07-29' },
];

export function getEraStartYear(era: Era): number {
  return new Date(era.startDate).getFullYear();
}

export function getEraMaxYear(era: Era): number {
  const startYear = getEraStartYear(era);
  const endYear = era.endDate
    ? new Date(era.endDate).getFullYear()
    : new Date().getFullYear() + 10;
  return endYear - startYear + 1;
}
