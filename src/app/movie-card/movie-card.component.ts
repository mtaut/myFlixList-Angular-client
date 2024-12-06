// Movie card component (Home screen) after user logs in
import { Component, OnInit } from '@angular/core'; // Core angular imports
import { UserRegistrationService } from '../fetch-api-data.service'; // Import for API calls
import { MatDialog } from '@angular/material/dialog'; // Import for dialog feedback
import { Router } from '@angular/router'; // Import for routing
import { InfoDialogComponent } from '../info-dialog/info-dialog.component'; // Import for dialog feedback
import { MatSnackBar } from '@angular/material/snack-bar'; // Import for UI notifications

/**
 * MovieCardComponent
 *
 * This component is responsible for displaying a list of movies in a card layout.
 * It includes functionality to fetch movies, interact with dialogs, and manage user-specific data.
 */
@Component({
  selector: 'app-movie-card',
  standalone: false,
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss',
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  user: any;

  constructor(
    public fetchApiData: UserRegistrationService,
    public dialog: MatDialog,
    public router: Router,
    public snackBar: MatSnackBar
  ) {}

  /**
   * Lifecycle hook that is called after the component is initialized.
   *
   * - Calls `initializeUser` to load the logged-in user data from localStorage.
   * - Calls `getMovies` to fetch and display the list of movies.
   */
  ngOnInit(): void {
    this.initializeUser();
    this.getMovies();
  }

  /**
   * Initializes the logged-in user by retrieving their data from localStorage.
   *
   * If user data exists in localStorage, it is parsed and assigned to the `user` property.
   */
  initializeUser(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
  }

  // Fetches list of movies from API, with movie info: genre, director, storyline premise

  getMovies(): void {
    // Fetches movies from API
    this.fetchApiData.getAllMovies().subscribe(
      (response: any) => {
        this.movies = response.map((movie: any) => ({
          ...movie,

          // Checks favorite movies with user
          isFavorite: this.user?.FavoriteMovies.includes(movie._id),
        }));
        console.log(this.movies);
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  getGenre(genre: { Name: string; Description: string }): void {
    this.dialog.open(InfoDialogComponent, {
      width: '300px',
      data: { title: `${genre.Name}`, info: genre.Description },
    });
  }

  getDirector(director: string): void {
    this.dialog.open(InfoDialogComponent, {
      width: '300px',
      data: { title: 'Director', info: director },
    });
  }

  getDescription(description: string): void {
    this.dialog.open(InfoDialogComponent, {
      width: '300px',
      data: { title: 'Premise', info: description },
    });
  }

  toggleFavorite(movie: any): void {
    if (movie.isFavorite) {
      // Remove from favorites
      this.fetchApiData
        .deleteFavoriteMovie(this.user.Username, movie._id)
        .subscribe(
          (response) => {
            movie.isFavorite = false;
            this.user.FavoriteMovies = response.FavoriteMovies;
            localStorage.setItem('user', JSON.stringify(this.user));
            this.snackBar.open('Movie removed from favorites', 'OK', {
              duration: 2000,
            });
          },
          (error) => {
            console.error('Error removing movie from favorites:', error);
          }
        );
    } else {
      // Add to favorites
      this.fetchApiData
        .addFavoriteMovie(this.user.Username, movie._id)
        .subscribe(
          (response) => {
            movie.isFavorite = true;
            this.user.FavoriteMovies = response.FavoriteMovies;
            localStorage.setItem('user', JSON.stringify(this.user));
            this.snackBar.open('Movie added to favorites', 'OK', {
              duration: 2000,
            });
          },
          (error) => {
            console.error('Error adding movie to favorites:', error);
          }
        );
    }
  }
  // Routes user to their profile view
  userProfile(): void {
    this.router.navigate(['profile']);
  }

  // Routes user to logout/welcome page
  logout(): void {
    this.router.navigate(['welcome']);
    localStorage.removeItem('user');
  }
}
