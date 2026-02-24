import { ERAS, getEraStartYear } from './eras';
import { Holiday, getHolidays } from './holidays';

// ── Date building helpers ──────────────────────────────────────────────────

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function fmtDate(year: number, month: number, day: number): string {
  return `${year}-${pad(month)}-${pad(day)}`;
}

// Japanese day-of-week names
const DAY_OF_WEEK_JA = ['日', '月', '火', '水', '木', '金', '土'];
const DAY_OF_WEEK_FULL_JA = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'];

const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// ── Wareki ↔ Seireki ──────────────────────────────────────────────────────

export function warekiToSeireki(
  eraName: string,
  eraYear: number,
  month?: number,
  day?: number,
): { year: number; month?: number; day?: number } | null {
  const era = ERAS.find((e) => e.name === eraName);
  if (!era) return null;

  const startYear = getEraStartYear(era);
  const westernYear = startYear + (eraYear - 1);

  const eraStart = new Date(era.startDate);
  const eraEnd = era.endDate ? new Date(era.endDate) : null;

  if (month !== undefined && day !== undefined) {
    const date = new Date(westernYear, month - 1, day);
    // Check leap year validity
    if (date.getMonth() !== month - 1) return null; // e.g. Feb 30
    if (date < eraStart) return null;
    if (eraEnd && date > eraEnd) return null;
    return { year: westernYear, month, day };
  }

  if (month !== undefined) {
    const monthStart = new Date(westernYear, month - 1, 1);
    const monthEnd = new Date(westernYear, month, 0);
    if (monthEnd < eraStart) return null;
    if (eraEnd && monthStart > eraEnd) return null;
    return { year: westernYear, month };
  }

  // Year only
  const yearStart = new Date(westernYear, 0, 1);
  const yearEnd = new Date(westernYear, 11, 31);
  if (yearEnd < eraStart) return null;
  if (eraEnd && yearStart > eraEnd) return null;
  return { year: westernYear };
}

export function seirekiToWareki(
  year: number,
  month?: number,
  day?: number,
): { eraName: string; eraYear: number } | null {
  for (const era of ERAS) {
    const eraStart = new Date(era.startDate);
    const eraEnd = era.endDate ? new Date(era.endDate) : null;
    const startYear = getEraStartYear(era);

    let checkDate: Date;
    if (month !== undefined && day !== undefined) {
      checkDate = new Date(year, month - 1, day);
    } else if (month !== undefined) {
      // Use end of month for partial date check
      checkDate = new Date(year, month, 0);
    } else {
      // Year only: check if any part of the year overlaps
      const yearEnd = new Date(year, 11, 31);
      const yearStart = new Date(year, 0, 1);
      if (yearEnd < eraStart) continue;
      if (eraEnd && yearStart > eraEnd) continue;
      const eraYear = year - startYear + 1;
      if (eraYear < 1) continue;
      return { eraName: era.name, eraYear };
    }

    if (checkDate < eraStart) continue;
    if (eraEnd && checkDate > eraEnd) continue;

    const eraYear = year - startYear + 1;
    if (eraYear < 1) continue;
    return { eraName: era.name, eraYear };
  }
  return null;
}

// Format wareki string (元年 for year 1)
export function formatWareki(
  eraName: string,
  eraYear: number,
  month?: number,
  day?: number,
  dayOfWeekIdx?: number,
): string {
  const yearStr = eraYear === 1 ? '元' : String(eraYear);
  let result = `${eraName}${yearStr}年`;
  if (month !== undefined) result += `${month}月`;
  if (day !== undefined) result += `${day}日`;
  if (dayOfWeekIdx !== undefined) result += `（${DAY_OF_WEEK_JA[dayOfWeekIdx]}）`;
  return result;
}

// Format seireki string
export function formatSeireki(
  year: number,
  month?: number,
  day?: number,
  dayOfWeekIdx?: number,
): string {
  let result = `${year}年`;
  if (month !== undefined) result += `${month}月`;
  if (day !== undefined) result += `${day}日`;
  if (dayOfWeekIdx !== undefined) result += `（${DAY_OF_WEEK_JA[dayOfWeekIdx]}）`;
  return result;
}

// Format english seireki
export function formatSeirekiEn(
  year: number,
  month?: number,
  day?: number,
  dayOfWeekIdx?: number,
): string {
  if (month === undefined) return String(year);
  if (day === undefined) return `${MONTHS_EN[month - 1]} ${year}`;
  const dow = dayOfWeekIdx !== undefined ? `${DAYS_EN[dayOfWeekIdx]}, ` : '';
  return `${dow}${MONTHS_EN[month - 1]} ${day}, ${year}`;
}

// ── Unix timestamp ─────────────────────────────────────────────────────────

// Returns UNIX timestamp for JST midnight of the given date
export function dateToUnixTimestamp(
  year: number,
  month: number,
  day: number,
): { seconds: number; milliseconds: number } {
  // JST midnight = UTC midnight - 9 hours
  const ms = Date.UTC(year, month - 1, day) - 9 * 3600 * 1000;
  return { seconds: Math.floor(ms / 1000), milliseconds: ms };
}

// Auto-detect seconds (10 digits) or milliseconds (13 digits)
export function unixTimestampToDate(timestamp: number): {
  year: number;
  month: number;
  day: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  let ms: number;
  if (timestamp > 1e12) {
    // milliseconds
    ms = timestamp;
  } else {
    ms = timestamp * 1000;
  }

  // Convert to JST
  const jstMs = ms + 9 * 3600 * 1000;
  const d = new Date(jstMs);

  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
    hours: d.getUTCHours(),
    minutes: d.getUTCMinutes(),
    seconds: d.getUTCSeconds(),
  };
}

// ── ISO 8601 ───────────────────────────────────────────────────────────────

export function dateToISO8601(year: number, month: number, day: number): string {
  return `${year}-${pad(month)}-${pad(day)}T00:00:00+09:00`;
}

export function iso8601ToDate(str: string): {
  year: number;
  month: number;
  day: number;
  hours: number;
  minutes: number;
  seconds: number;
  hasTime: boolean;
} | null {
  // Try to parse various ISO 8601 formats
  const patterns = [
    // With timezone
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})([+-]\d{2}:\d{2}|Z)$/,
    // Without timezone
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/,
    // Date only
    /^(\d{4})-(\d{2})-(\d{2})$/,
  ];

  for (const pattern of patterns) {
    const m = str.trim().match(pattern);
    if (!m) continue;

    const year = parseInt(m[1], 10);
    const month = parseInt(m[2], 10);
    const day = parseInt(m[3], 10);
    const hasTime = m[4] !== undefined;
    const hours = hasTime ? parseInt(m[4], 10) : 0;
    const minutes = hasTime ? parseInt(m[5], 10) : 0;
    const seconds = hasTime ? parseInt(m[6], 10) : 0;

    if (month < 1 || month > 12) return null;
    if (day < 1 || day > 31) return null;

    // If timezone info, convert to JST
    if (m[7] !== undefined && m[7] !== 'Z') {
      // Handle timezone offset
      const tzMatch = m[7].match(/([+-])(\d{2}):(\d{2})/);
      if (tzMatch) {
        const sign = tzMatch[1] === '+' ? 1 : -1;
        const tzH = parseInt(tzMatch[2], 10);
        const tzM = parseInt(tzMatch[3], 10);
        const tzOffsetMs = sign * (tzH * 60 + tzM) * 60 * 1000;
        const utcMs = Date.UTC(year, month - 1, day, hours, minutes, seconds) - tzOffsetMs;
        const jstMs = utcMs + 9 * 3600 * 1000;
        const d = new Date(jstMs);
        return {
          year: d.getUTCFullYear(),
          month: d.getUTCMonth() + 1,
          day: d.getUTCDate(),
          hours: d.getUTCHours(),
          minutes: d.getUTCMinutes(),
          seconds: d.getUTCSeconds(),
          hasTime,
        };
      }
    } else if (m[7] === 'Z') {
      // UTC → JST
      const utcMs = Date.UTC(year, month - 1, day, hours, minutes, seconds);
      const jstMs = utcMs + 9 * 3600 * 1000;
      const d = new Date(jstMs);
      return {
        year: d.getUTCFullYear(),
        month: d.getUTCMonth() + 1,
        day: d.getUTCDate(),
        hours: d.getUTCHours(),
        minutes: d.getUTCMinutes(),
        seconds: d.getUTCSeconds(),
        hasTime,
      };
    }

    return { year, month, day, hours, minutes, seconds, hasTime };
  }

  return null;
}

// ── Age calculation ────────────────────────────────────────────────────────

export function calculateAge(
  birthYear: number,
  birthMonth: number,
  birthDay: number,
): { fullAge: number; countingAge: number; daysUntilBirthday: number } | null {
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();

  const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
  if (birthDate > today) return null; // Future date

  // Full age (満年齢)
  let fullAge = todayYear - birthYear;
  const hasBirthdayPassed =
    todayMonth > birthMonth ||
    (todayMonth === birthMonth && todayDay >= birthDay);
  if (!hasBirthdayPassed) fullAge--;

  // Counting age (数え年)
  const countingAge = todayYear - birthYear + 1;

  // Days until next birthday
  let nextBirthday = new Date(todayYear, birthMonth - 1, birthDay);
  if (nextBirthday <= today) {
    nextBirthday = new Date(todayYear + 1, birthMonth - 1, birthDay);
  }
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysUntilBirthday = Math.ceil(
    (nextBirthday.getTime() - today.getTime()) / msPerDay,
  );

  return { fullAge, countingAge, daysUntilBirthday };
}

// ── Business days ──────────────────────────────────────────────────────────

export function calculateBusinessDays(
  startYear: number,
  startMonth: number,
  startDay: number,
  endYear: number,
  endMonth: number,
  endDay: number,
): { calendarDays: number; businessDays: number; holidays: Holiday[] } {
  const start = new Date(startYear, startMonth - 1, startDay);
  const end = new Date(endYear, endMonth - 1, endDay);

  if (end < start) {
    return { calendarDays: 0, businessDays: 0, holidays: [] };
  }

  const msPerDay = 24 * 60 * 60 * 1000;
  const calendarDays = Math.round((end.getTime() - start.getTime()) / msPerDay) + 1;

  // Collect all holidays in range
  const yearsInRange: number[] = [];
  for (let y = startYear; y <= endYear; y++) {
    yearsInRange.push(y);
  }

  const allHolidays: Holiday[] = yearsInRange.flatMap((y) => getHolidays(y));
  const holidayDates = new Set(allHolidays.map((h) => h.date));

  const holidaysInRange: Holiday[] = [];
  const holidayDatesInRange = new Set<string>();

  let businessDays = 0;
  const current = new Date(start);

  while (current <= end) {
    const dow = current.getDay(); // 0=Sun, 6=Sat
    const dateStr = fmtDate(
      current.getFullYear(),
      current.getMonth() + 1,
      current.getDate(),
    );

    if (dow !== 0 && dow !== 6 && !holidayDates.has(dateStr)) {
      businessDays++;
    } else if (dow !== 0 && dow !== 6 && holidayDates.has(dateStr)) {
      // Weekday holiday
      if (!holidayDatesInRange.has(dateStr)) {
        const hol = allHolidays.find((h) => h.date === dateStr);
        if (hol) {
          holidaysInRange.push(hol);
          holidayDatesInRange.add(dateStr);
        }
      }
    }

    current.setDate(current.getDate() + 1);
  }

  return { calendarDays, businessDays, holidays: holidaysInRange };
}

// ── Day of week ────────────────────────────────────────────────────────────

export function getDayOfWeekIndex(year: number, month: number, day: number): number {
  return new Date(year, month - 1, day).getDay();
}

export function getDayOfWeek(year: number, month: number, day: number): string {
  return DAY_OF_WEEK_FULL_JA[getDayOfWeekIndex(year, month, day)];
}

// ── Full conversion result ─────────────────────────────────────────────────

export interface ConversionResult {
  year: number;
  month: number | null;
  day: number | null;
  hours: number | null;
  minutes: number | null;
  seconds: number | null;
  eraName: string | null;
  eraYear: number | null;
  warekiStr: string;
  seirekiStr: string;
  seirekiEnStr: string;
  unixSeconds: number | null;
  unixMs: number | null;
  iso8601Str: string | null;
  dayOfWeekIndex: number | null;
  dayOfWeekStr: string | null;
}

export function buildConversionResult(
  year: number,
  month: number | null,
  day: number | null,
  hours?: number,
  minutes?: number,
  seconds?: number,
): ConversionResult {
  const wareki = seirekiToWareki(
    year,
    month ?? undefined,
    day ?? undefined,
  );

  const dowIdx =
    month !== null && day !== null
      ? getDayOfWeekIndex(year, month, day)
      : null;

  const warekiStr =
    wareki !== null
      ? formatWareki(
          wareki.eraName,
          wareki.eraYear,
          month ?? undefined,
          day ?? undefined,
          dowIdx ?? undefined,
        )
      : `${year}年（和暦範囲外）`;

  const seirekiStr = formatSeireki(
    year,
    month ?? undefined,
    day ?? undefined,
    dowIdx ?? undefined,
  );

  const seirekiEnStr = formatSeirekiEn(
    year,
    month ?? undefined,
    day ?? undefined,
    dowIdx ?? undefined,
  );

  let unixSeconds: number | null = null;
  let unixMs: number | null = null;
  let iso8601Str: string | null = null;

  if (month !== null && day !== null) {
    const unix = dateToUnixTimestamp(year, month, day);
    unixSeconds = unix.seconds;
    unixMs = unix.milliseconds;
    iso8601Str = dateToISO8601(year, month, day);
  }

  return {
    year,
    month,
    day,
    hours: hours ?? null,
    minutes: minutes ?? null,
    seconds: seconds ?? null,
    eraName: wareki?.eraName ?? null,
    eraYear: wareki?.eraYear ?? null,
    warekiStr,
    seirekiStr,
    seirekiEnStr,
    unixSeconds,
    unixMs,
    iso8601Str,
    dayOfWeekIndex: dowIdx,
    dayOfWeekStr: dowIdx !== null ? getDayOfWeek(year, month!, day!) : null,
  };
}
