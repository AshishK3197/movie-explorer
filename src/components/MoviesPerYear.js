
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {API_KEY} from "../App";

const MoviesPerYear = () => {
    const [moviesData, setMoviesData] = useState({});

    const apiKey = API_KEY;

    useEffect(() => {
        const fetchMoviesData = async () => {
            const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
            const moviesPromises = years.map(async (year) => {
                const response = await axios.get(`https://www.omdbapi.com/?apikey=${apiKey}&y=${year}&type=movie`);
                return { year, count: response.data.totalResults || 0 };
            });

            const moviesData = await Promise.all(moviesPromises);
            setMoviesData(moviesData.reduce((acc, { year, count }) => {
                acc.labels.push(year);
                acc.data.push(count);
                return acc;
            }, { labels: [], data: [] }));
        };

        fetchMoviesData();
    }, [apiKey]);

    const data = {
        labels: moviesData.labels,
        datasets: [
            {
                label: 'Movies Released',
                data: moviesData.data,
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
            },
        ],
    };

    return (
        <div>
            <h2>Movies Released Per Year</h2>
            <Line data={data} />
        </div>
    );
};

export default MoviesPerYear;
