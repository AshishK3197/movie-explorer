import React, { useState } from "react";
import Axios from "axios";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

import MovieComponent from "./components/MovieComponent";
import MovieInfoComponent from "./components/MovieInfoComponent";
import ChartPage from "./components/ChartPage";

export const API_KEY = process.env.REACT_APP_API_KEY;

function App() {
  const [searchQuery, updateSearchQuery] = useState("");
  const [movieList, updateMovieList] = useState([]);
  const [selectedMovie, onMovieSelect] = useState();
  const [timeoutId, updateTimeoutId] = useState();

  const fetchData = async (searchString) => {
    const response = await Axios.get(
        `https://www.omdbapi.com/?s=${searchString}&apikey=${API_KEY}`
    );
    updateMovieList(response.data.Search);
  };

  const onTextChange = (e) => {
    onMovieSelect("");
    clearTimeout(timeoutId);
    updateSearchQuery(e.target.value);
    const timeout = setTimeout(() => fetchData(e.target.value), 500);
    updateTimeoutId(timeout);
  };

  return (
      <Router>
        <div className="container">
          <div className="header">
            <div className="app-name">
              <img
                  className="movie-image"
                  src="/react-movie-app/movie-icon.svg"
                  alt="Movie Icon"
              />
              <Link className="route-link" to="/">IMDB Movie Search</Link>
            </div>
            <div className="search-box">
              <img
                  className="search-icon"
                  src="/react-movie-app/search-icon.svg"
                  alt="Search Icon"
              />
              <input
                  className="search-input"
                  type="text"
                  placeholder="Search Movie"
                  value={searchQuery}
                  onChange={onTextChange}
              />
            </div>
            <Link to="/charts" className="route-link">
              View Charts
            </Link>
          </div>
          {selectedMovie && (
              <MovieInfoComponent
                  selectedMovie={selectedMovie}
                  onMovieSelect={onMovieSelect}
              />
          )}
          <Routes>
            <Route
                path="/"
                element={
                  <div className="movie-list-container">
                    {movieList?.length ? (
                        movieList.map((movie, index) => (
                            <MovieComponent
                                key={index}
                                movie={movie}
                                onMovieSelect={onMovieSelect}
                            />
                        ))
                    ) : (
                        <img
                            className="placeholder"
                            src="/react-movie-app/movie-icon.svg"
                            alt="Movie Icon Placeholder"
                        />
                    )}
                  </div>
                }
            />
            <Route path="/charts" element={<ChartPage />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
