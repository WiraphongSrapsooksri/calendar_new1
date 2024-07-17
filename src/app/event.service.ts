import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(private http: HttpClient) {}

  getEvents(): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>('/assets/events.json').pipe(
      map(events => events.map(event => ({
        ...event,
        start: new Date(event.start),
        end: event.end ? new Date(event.end) : undefined
      })))
    );
  }
}
