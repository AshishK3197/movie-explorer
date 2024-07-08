
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {API_KEY} from "../App";

const MostPopularDirectors = () => {
    const [directorsData, setDirectorsData] = useState({});

    const apiKey = API_KEY; // Replace with your OMDb API key

    useEffect(() => {
        const fetchDirectorsData = async () => {
            const directors = ['Steven Spielberg', 'Christopher Nolan', 'Martin Scorsese', 'Quentin Tarantino', 'James Cameron'];
            const directorsPromises = directors.map(async (director) => {
                const response = await axios.get(`https://www.omdbapi.com/?apikey=${apiKey}&s=${director}&type=movie`);
                return { director, count: response.data.totalResults || 0 };
            });

            const directorsData = await Promise.all(directorsPromises);
            setDirectorsData(directorsData.reduce((acc, { director, count }) => {
                acc.labels.push(director);
                acc.data.push(count);
                return acc;
            }, { labels: [], data: [] }));
        };

        fetchDirectorsData();
    }, [apiKey]);

    const data = {
        labels: directorsData.labels,
        datasets: [
            {
                label: 'Number of Movies',
                data: directorsData.data,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div>
            <h2>Most Popular Directors</h2>
            <Bar data={data} />
        </div>
    );
};

export default MostPopularDirectors;
