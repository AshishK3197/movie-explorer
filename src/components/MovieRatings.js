
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {API_KEY} from "../App";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MovieRatings = () => {
    const [averageRatings, setAverageRatings] = useState({});
    const apiKey = API_KEY;
    const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi'];

    useEffect(() => {
        const fetchGenreData = async () => {
            try {
                const ratingsPromises = genres.map(async (genre) => {

                    const moviesResponse = await axios.get(`https://www.omdbapi.com/?apikey=${apiKey}&s=${genre}&type=movie`);
                    const movies = moviesResponse.data.Search;

                    if (!movies) return { genre, averageRating: 0 };

                    const movieDetailsPromises = movies.map(async (movie) => {
                        const movieDetailResponse = await axios.get(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}`);
                        return movieDetailResponse.data;
                    });

                    const movieDetails = await Promise.all(movieDetailsPromises);
                    const genreMovies = movieDetails.filter(movie => movie.Genre.includes(genre));

                    const totalRating = genreMovies.reduce((sum, movie) => sum + parseFloat(movie.imdbRating), 0);
                    const averageRating = genreMovies.length ? totalRating / genreMovies.length : 0;

                    return { genre, averageRating };
                });

                const ratings = await Promise.all(ratingsPromises);
                const ratingsObject = ratings.reduce((obj, item) => ({ ...obj, [item.genre]: item.averageRating }), {});

                setAverageRatings(ratingsObject);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchGenreData();
    }, [apiKey]);

    const data = {
        labels: Object.keys(averageRatings),
        datasets: [
            {
                label: 'Average Rating',
                data: Object.values(averageRatings),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div>
            <h2>Average Movie Ratings by Genre</h2>
            <Bar data={data} />
        </div>
    );
};

export default MovieRatings;
