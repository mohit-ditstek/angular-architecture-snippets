import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CalendarDateFormatter, CalendarEvent, CalendarView } from 'angular-calendar';
import { isSameDay, isSameMonth } from 'date-fns';
import { Subject } from 'rxjs';
import { DateUtils } from 'src/app/core/util/DateUtils';
import { CustomDateFormatter } from 'src/app/ui-component/components/tgt-event-calendar/custom-date-formatter.provider';

@Component({
  selector: 'tgt-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tgt-calendar.component.html',
  styleUrls: ['./tgt-calendar.component.scss'],
  providers: [{
    provide: CalendarDateFormatter,
    useClass: CustomDateFormatter,
  },]
})
export class TgtCalendarComponent implements OnInit {

  @Input() allData: Array<any> = []
  @Input() viewDate: Date = new Date();
  @Output() onDayClick = new EventEmitter<any>()
  @Output() editEvent = new EventEmitter<any>();
  @Output() cancelEvent = new EventEmitter<any>();
  @Output() declineEvent = new EventEmitter<any>();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  refresh: Subject<any> = new Subject();
  events: CalendarEvent[]=[];
  activeDayIsOpen: boolean = true;

  constructor(  
            private datePipe: DatePipe) { 
            }

  ngOnInit() {
  }

  onCancelEvent(data) {
    this.cancelEvent.emit(data);
  }
  onEditEvent(data){
    this.editEvent.emit(data);
  }
  onClickDeclineEvent(data){
    this.declineEvent.emit(data)
  }
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    this.onDayClick.emit(date);
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  preventFromOpeningDayView(e, data){
   if(data?.openModal)
    e.stopPropagation()
  }
}
