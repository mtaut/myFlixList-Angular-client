import { Component, OnInit } from '@angular/core';
import { UserRegistrationService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: false,

  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
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

  updateUser(): void {
    this.fetchApiData
      .editUser(this.userData.Username, this.updateUser)
      .subscribe(
        (response) => {
          this.snackBar.open('User details updated successfully', 'OK', {
            duration: 2000,
          });
          this.userData = { ...this.updateUser };
          this.editMode = false;
        },
        (error) => {
          console.error(error);
          this.snackBar.open('Error updating user profile', 'OK', {
            duration: 2000,
          });
        }
      );
  }

  deleteUser(): void {
    this.fetchApiData.deleteUser(this.userData.Username).subscribe(
      () => {
        this.snackBar.open('Profile deleted successfully.', 'OK', {
          duration: 2000,
        });
        localStorage.clear();
        this.router.navigate(['/welcome']);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getFavoriteMovies(): void {
    this.fetchApiData
      .getUserFavoriteMovies(this.userData.Username, '')
      .subscribe(
        (response: any) => {
          this.favoriteMovies = response;
        },
        (error) => {
          console.error(error);
          this.snackBar.open('Error fetching favorite movies.', 'OK', {
            duration: 2000,
          });
        }
      );
  }

  deleteFavoriteMovie(movieId: string): void {
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
