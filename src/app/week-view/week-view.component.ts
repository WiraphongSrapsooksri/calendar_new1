import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CalendarEvent } from 'angular-calendar';
import { addWeeks, subWeeks } from 'date-fns';
import { Subject } from 'rxjs';
import { EventDialogComponent } from '../event-dialog/event-dialog.component';
import { EventService } from '../event.service';

@Component({
  selector: 'app-week-view',
  templateUrl: './week-view.component.html',
  styleUrls: ['./week-view.component.css']
})
export class WeekViewComponent implements OnInit {
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  refresh: Subject<any> = new Subject();
  @ViewChild('eventTemplate', { static: true }) eventTemplate!: TemplateRef<any>;

  constructor(private dialog: MatDialog, private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEventsFromLocalStorage();
  }

  loadEventsFromLocalStorage(): void {
    const storedEvents = localStorage.getItem('listEvents');
    if (storedEvents) {
      this.events = JSON.parse(storedEvents).map((event: any) => ({
        ...event,
        start: new Date(event.start),
        end: event.end ? new Date(event.end) : undefined,
        meta: event.meta ?? {},  // Ensure meta is defined
      }));
      this.refresh.next(true);
    } else {
      this.eventService.getEvents().subscribe(events => {
        this.events = events.map((event: any) => ({
          ...event,
          start: new Date(event.start),
          end: event.end ? new Date(event.end) : undefined,
          meta: event.meta ?? {},  // Ensure meta is defined
        }));
        localStorage.setItem('listEvents', JSON.stringify(this.events));
        this.refresh.next(true);
      });
    }
  }

  addEvent(event: CalendarEvent): void {
    const newEvent = {
      ...event,
      start: new Date(event.start),
      end: event.end ? new Date(event.end) : undefined,
      meta: event.meta ?? {},  // Ensure meta is defined
    };
    this.events = [...this.events, newEvent];
    localStorage.setItem('listEvents', JSON.stringify(this.events));
    console.log("Event added:", this.events); // Debug log
    this.refresh.next(true); // Trigger a refresh
  }

  handleEventClicked(event: CalendarEvent): void {
    const dialogRef = this.dialog.open(EventDialogComponent, {
      width: '300px',
      data: { event: { ...event }, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.action === 'delete') {
          this.events = this.events.filter(e => e !== event);
        } else {
          const updatedEvent = {
            ...result.event,
            start: new Date(result.event.start),
            end: result.event.end ? new Date(result.event.end) : undefined,
            meta: result.event.meta ?? {},  // Ensure meta is defined
          };
          this.events = this.events.map(e => (e === event ? updatedEvent : e));
        }
        localStorage.setItem('listEvents', JSON.stringify(this.events));
        console.log("Event updated:", this.events); // Debug log
        this.refresh.next(true); // Trigger a refresh
      }
    });
  }

  handleHourSegmentClicked(event: any): void {
    const date = event.date;
    const formattedDate = date.toLocaleDateString('en-US', { weekday: 'long', year: '2-digit', month: 'numeric', day: 'numeric' });
    const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const formatshowdate = formattedDate + " " + formattedTime;
    const dialogRef = this.dialog.open(EventDialogComponent, {
      width: '300px',
      data: {
        event: {
          title: '',
          start: date,
          end: new Date(date.getTime() + 60 * 60 * 1000), // Default end time 1 hour later
          meta: { phone: '', bed: '', deposit: '', additional: '', titleshowdate: formatshowdate },
          color: { primary: '#1e90ff', secondary: '#D1E8FF' },
        },
        isEdit: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addEvent(result.event);
      }
    });
  }

  handleBedClicked(date: Date, bed: number): void {
    const formattedDate = date.toLocaleDateString('en-US', { weekday: 'long', year: '2-digit', month: 'numeric', day: 'numeric' });
    const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const formatshowdate = formattedDate + " " + formattedTime;
    const dialogRef = this.dialog.open(EventDialogComponent, {
      width: '300px',
      data: {
        event: {
          title: '',
          start: date,
          end: new Date(date.getTime() + 60 * 60 * 1000), // Default end time 1 hour later
          meta: { phone: '', bed: bed, deposit: '', additional: '', titleshowdate: formatshowdate },
          color: { primary: '#1e90ff', secondary: '#D1E8FF' },
        },
        isEdit: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addEvent(result.event);
      }
    });
  }

  getEventsForBed(date: Date, bed: number): CalendarEvent[] {
    return this.events.filter(event => event.start.getDate() === date.getDate() && event.meta?.bed === bed);
  }

  previousWeek(): void {
    this.viewDate = subWeeks(this.viewDate, 1);
  }

  nextWeek(): void {
    this.viewDate = addWeeks(this.viewDate, 1);
  }

  beforeViewRender(renderEvent: any): void {
    renderEvent.hourColumns.forEach((hourColumn: any) => {
      hourColumn.hours.forEach((hour: any) => {
        hour.segments.forEach((segment: any) => {
          segment.isBedSegment = true;
        });
      });
    });
  }
}
