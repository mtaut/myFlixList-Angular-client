// Component for user to register a profile
import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog'; // Will use this import to close the dialog on success
import { UserRegistrationService } from '../fetch-api-data.service'; // This import brings the API calls created in ex6.2
import { MatSnackBar } from '@angular/material/snack-bar'; // This import is used to display notifications back to the user

@Component({
  selector: 'app-user-registration-form',
  standalone: false,

  templateUrl: './user-registration-form.component.html',
  styleUrl: './user-registration-form.component.scss',
})

// Exporting component to be used throughout app
export class UserRegistrationFormComponent implements OnInit {
  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  constructor(
    public fetchApiData: UserRegistrationService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  // This function will send the form inputs to the API
  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe(
      (response) => {
        // Logic for successful user registration goes here
        this.dialogRef.close(); // This will close the modal on success
        console.log(response);
        // Notification that action was successful and user has been registered
        this.snackBar.open('user successfully registered', 'OK', {
          duration: 2000,
        });
      },
      (response) => {
        console.log(response);
        this.snackBar.open(response, 'OK', {
          duration: 2000,
        });
      }
    );
  }
}
