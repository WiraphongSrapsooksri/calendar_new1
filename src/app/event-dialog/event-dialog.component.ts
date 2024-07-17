// event-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CalendarEvent } from 'angular-calendar';

@Component({
  selector: 'app-event-dialog',
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.css']
})
export class EventDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { event: CalendarEvent; isEdit: boolean }
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    const duration = this.data.event.meta.duration || 60; // Default to 1 hour if not set
    const endTime = new Date(this.data.event.start);
    endTime.setMinutes(endTime.getMinutes() + duration);

    const event = {
      ...this.data.event,
      start: new Date(this.data.event.start),
      end: endTime,
    };
    this.dialogRef.close({ event, action: 'save' });
  }

  onDelete(): void {
    this.dialogRef.close({ event: this.data.event, action: 'delete' });
  }
}
