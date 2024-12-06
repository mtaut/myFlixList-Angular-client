// Component for user profile page
import { Component, OnInit } from '@angular/core'; // Core Angular imports to create templates and complete lifecycle hooks
import { UserRegistrationService } from '../fetch-api-data.service'; // Import for API calls
import { MatSnackBar } from '@angular/material/snack-bar'; // Import for UI interaction
import { Router } from '@angular/router'; // Import for routing

@Component({
  selector: 'app-user-profile',
  standalone: false,

  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})

// Holds logged-in user's profile data
export class UserProfileComponent implements OnInit {
  userData: any = {};
  editUser: any = { username: '', password: '', email: '', birthday: '' };
  favoriteMovies: any[] = [];
  token: string | null = '';
  editMode: boolean = false;

  constructor(
    public fetchApiData: UserRegistrationService,
    public router: Router,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    this.userData = storedUser ? JSON.parse(storedUser) : {};
    this.getUser();
    this.getFavoriteMovies();
  }

  // Function to get user from local storage
  getUser(): void {
    const username = localStorage.getItem('username'); // Ensure username is fetched from localStorage
    if (username) {
      this.fetchApiData.getUser(username).subscribe(
        (response) => {
          this.userData = response; // Update userData with the fetched response
          localStorage.setItem('user', JSON.stringify(this.userData)); // Update localStorage with the fetched data
          this.editUser = { ...response }; // Copy the data for editing
        },
        (error) => {
          console.error(error);
          this.snackBar.open('Error fetching user details.', 'OK', {
            duration: 2000,
          });
        }
      );
    } else {
      this.snackBar.open('Username not found in local storage.', 'OK', {
        duration: 2000,
      });
    }
  }

  // Function to update user info
  updateUser(): void {
    // Call to editUser method to update user info
    this.fetchApiData
      .editUser(this.userData.Username, this.updateUser)
      .subscribe(
        (response) => {
          // On successful response from API show a success notification
          this.snackBar.open('User details updated successfully', 'OK', {
            duration: 2000,
          });
          // Update local userData with new values from upateUser
          this.userData = { ...this.updateUser };
          this.editMode = false;
        },
        (error) => {
          // Log errors to console for debugging
          console.error(error);
          this.snackBar.open('Error updating user profile', 'OK', {
            duration: 2000,
          });
        }
      );
  }

  // Function to delete user's profile
  deleteUser(): void {
    // Call deleteUser method from UserRegistrationService to delete user
    this.fetchApiData.deleteUser(this.userData.Username).subscribe(
      () => {
        // On successful deletion show a success notification
        this.snackBar.open('Profile deleted successfully.', 'OK', {
          duration: 2000,
        });
        // Clear user data from local storage
        localStorage.clear();
        // Navigate to welcome screen
        this.router.navigate(['/welcome']);
      },
      (error) => {
        // Log errors to console for debugging
        console.log(error);
      }
    );
  }

  // Function to get user's favorite movies
  getFavoriteMovies(): void {
    // Call to API to match favorite movies against user's username
    this.fetchApiData
      .getUserFavoriteMovies(this.userData.Username, '')
      .subscribe(
        (response: any) => {
          this.favoriteMovies = response;
        },
        (error) => {
          // Log errors to console for debugging
          console.error(error);
          this.snackBar.open('Error fetching favorite movies.', 'OK', {
            duration: 2000,
          });
        }
      );
  }

  // Function to delete movie from user's favorite movies
  deleteFavoriteMovie(movieId: string): void {
    // Call to API to delete movie
    this.fetchApiData
      .deleteFavoriteMovie(this.userData.Username, movieId)
      .subscribe(
        () => {
          this.snackBar.open('Movie removed from favorites.', 'OK', {
            duration: 2000,
          });
          this.getFavoriteMovies();
        },
        (error) => {
          // Log error to console for debugging
          console.error(error);
          this.snackBar.open('Error removing movie from favorites.', 'OK', {
            duration: 2000,
          });
        }
      );
  }

  logout(): void {
    this.router.navigate(['welcome']);
    localStorage.removeItem('user');
  }

  getMovies(): void {
    this.router.navigate(['movies']);
  }
}
