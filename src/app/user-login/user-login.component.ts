// User login component
import { Component, OnInit, Input } from '@angular/core'; // Core angular imports to create components, lifecycle hooks, and binding
import { MatDialogRef } from '@angular/material/dialog'; // Import to use dialog info box
import { UserRegistrationService } from '../fetch-api-data.service'; // Import for API calls
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component'; // Import for login logic
import { MatSnackBar } from '@angular/material/snack-bar'; // Import for notifications, UI feedback
import { Router } from '@angular/router'; // Import for routing

@Component({
  // Components used for template
  selector: 'app-user-login',
  standalone: false,

  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.scss',
})
export class UserLoginComponent implements OnInit {
  // Username and password credentials
  @Input() userData = { Username: '', Password: '' };

  constructor(
    // Services being used
    public fetchApiData: UserRegistrationService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  // Lifecycle hook that is invoked after the component has been initialized
  ngOnInit(): void {}

  // Function to log in user
  userLogin(): void {
    this.fetchApiData.userLogin(this.userData).subscribe(
      // Call to API
      (response) => {
        localStorage.setItem('user', JSON.stringify(response.user)); //
        localStorage.setItem('token', response.token);
        this.dialogRef.close();
        console.log(response);
        this.snackBar.open(
          `Login successful. Welcome, ${response.user.Username}`,
          'OK',
          {
            duration: 2000,
          }
        );
        this.router.navigate(['movies']);
      },
      (response) => {
        console.log(response);
        this.snackBar.open(response, 'Login unsuccessful. Please try again.', {
          duration: 2000,
        });
      }
    );
  }
}
