import {
  CalendarUtils,
  CalendarA11y,
  CalendarEventTitleFormatter,
  CalendarDateFormatter,
  DateAdapter
} from 'angular-calendar';

import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

export const calendar_providers = [
  {
    provide: DateAdapter,
    useFactory: adapterFactory,
  },
  CalendarUtils,
  CalendarA11y,
  CalendarEventTitleFormatter,
  CalendarDateFormatter
];