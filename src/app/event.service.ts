import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(private http: HttpClient) {}

  getEvents(): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>('/assets/events.json').pipe(
      tap(events => {
        localStorage.setItem('listEvents', JSON.stringify(events));
      })
    );
  }
}
