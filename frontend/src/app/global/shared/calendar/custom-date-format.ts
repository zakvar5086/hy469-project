import { CalendarDateFormatter, DateFormatterParams } from 'angular-calendar';

export class CustomDateFormat extends CalendarDateFormatter {

  public override monthViewColumnHeader({ date, locale }: DateFormatterParams): string {
    return date.toLocaleDateString(locale, { weekday: 'short' }).charAt(0);
  }
}