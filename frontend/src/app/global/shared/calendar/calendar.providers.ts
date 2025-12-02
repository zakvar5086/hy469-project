import {
  CalendarUtils,
  CalendarA11y,
  CalendarEventTitleFormatter,
  CalendarDateFormatter,
  DateAdapter
} from 'angular-calendar';

import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CustomDateFormat } from './custom-date-format'; // <-- add this

export const calendar_providers = [
  {
    provide: DateAdapter,
    useFactory: adapterFactory,
  },
  CalendarUtils,
  CalendarA11y,
  CalendarEventTitleFormatter,

  { 
    provide: CalendarDateFormatter, 
    useClass: CustomDateFormat 
  }
];