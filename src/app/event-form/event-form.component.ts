import { Component, EventEmitter, Output } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { startOfDay } from 'date-fns';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent {
  eventName: string | undefined;
  eventPhone: string | undefined;

  @Output() newEvent = new EventEmitter<CalendarEvent>();

  onSubmit() {
    const event: CalendarEvent = {
      title: `${this.eventName} - ${this.eventPhone}`,
      start: startOfDay(new Date()),
      color: { primary: '#1e90ff', secondary: '#D1E8FF' }
    };
    this.newEvent.emit(event);
    this.eventName = '';
    this.eventPhone = '';
  }
}
