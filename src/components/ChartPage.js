import React, { useState } from 'react';
import MovieRatings from "./MovieRatings";
import MoviesPerYear from "./MoviesPerYear";
import MostPopularDirectors from "./MostPopularDirectors";
import '../styles/ChartPage.css';

const ChartPage = () => {
    const [selectedOption, setSelectedOption] = useState("averageRatings");

    const renderComponent = () => {
        switch (selectedOption) {
            case "moviesPerYear":
                return <MoviesPerYear />;
            case "averageRatings":
                return <MovieRatings />;
            case "mostPopularDirectors":
                return <MostPopularDirectors />;
            default:
                return <MovieRatings />;
        }
    };

    return (
        <div className="chart-container">
            <select
                onChange={(e) => setSelectedOption(e.target.value)}
                value={selectedOption}
                className="select-option"
            >
                <option value="moviesPerYear">Movies Per Year</option>
                <option value="averageRatings">Average Ratings Per Genre</option>
                <option value="mostPopularDirectors">Most Popular Directors</option>
            </select>
            <div className="chart-content">
                {renderComponent()}
            </div>
        </div>
    );
};

export default ChartPage;
