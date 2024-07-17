import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CalendarEvent } from 'angular-calendar';
import { addWeeks, subWeeks } from 'date-fns';
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
  hours: string[] = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  constructor(private dialog: MatDialog, private eventService: EventService) {}

  ngOnInit(): void {
    const storedEvents = localStorage.getItem('listEvents');
    if (storedEvents) {
      this.events = JSON.parse(storedEvents);
      this.events.forEach(event => {
        event.start = new Date(event.start);
        if (event.end) {
          event.end = new Date(event.end);
        }
      });
    } else {
      this.eventService.getEvents().subscribe(events => {
        if(events) {
          events.forEach(e => {
            e.start = new Date(e.start);
            if(e.end) {
              e.end = new Date(e.end);
            }
          });
        }
        this.events = events;
      });
    }
  }

  addEvent(event: CalendarEvent): void {
    this.events = [...this.events, event];
    localStorage.setItem('listEvents', JSON.stringify(this.events));
  }

  handleEventClicked(event: CalendarEvent): void {
    const dialogRef = this.dialog.open(EventDialogComponent, {
      width: '300px',
      data: { event: { ...event }, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.events = this.events.map(e => (e === event ? result : e));
        localStorage.setItem('listEvents', JSON.stringify(this.events));
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
          meta: { phone: '', titleshowdate: formatshowdate },
          color: { primary: '#1e90ff', secondary: '#D1E8FF' },
        },
        isEdit: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addEvent(result);
      }
    });
  }

  previousWeek(): void {
    this.viewDate = subWeeks(this.viewDate, 1);
  }

  nextWeek(): void {
    this.viewDate = addWeeks(this.viewDate, 1);
  }
}
