import { Component, OnInit } from '@angular/core';
import { UserRegistrationService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  ngOnInit(): void {
    this.initializeUser();
    this.getMovies();
  }

  initializeUser(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
  }

  // movie card with movie info: genre, director, storyline premis

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe(
      (response: any) => {
        this.movies = response.map((movie: any) => ({
          ...movie,
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

  userProfile(): void {
    this.router.navigate(['profile']);
  }

  logout(): void {
    this.router.navigate(['welcome']);
    localStorage.removeItem('user');
  }
}
