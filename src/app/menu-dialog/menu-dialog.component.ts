import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-menu-dialog',
  templateUrl: './menu-dialog.component.html',
  styleUrls: ['./menu-dialog.component.css']
})
export class MenuDialogComponent {
  selectedBed: number = 1; // Default to 1

  constructor(
    public dialogRef: MatDialogRef<MenuDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}


  onCancel(): void {
    this.dialogRef.close();
  }

  onEdit(): void {
    this.dialogRef.close({ action: 'edit', event: this.data.event });
  }

  onAdd(): void {
    this.dialogRef.close({ action: 'add', event: this.data.event });
  }

  onDelete(): void {
    this.dialogRef.close({ action: 'delete', event: this.data.event });
  }
}
