// Info dialog component for movie information that will display dialog box with title and information
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-info-dialog',
  standalone: false,

  templateUrl: './info-dialog.component.html',
  styleUrl: './info-dialog.component.scss',
})
export class InfoDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string; info: string }
  ) {}
}
