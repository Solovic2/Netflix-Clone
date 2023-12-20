import axios from "./axios";
import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import requests from "./requests";
import "./banner.css";
import movieTrailer from "movie-trailer";
import YouTube from "react-youtube";
const Banner = () => {
  const [movie, setMovie] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  const { error } = Modal;
  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };
  useEffect(() => {
    const fetchMovie = async () => {
      const randomMovie = await axios.get(requests.fetchDiscoverMovies);
      setMovie(
        randomMovie.data.results[
          Math.floor(Math.random() * randomMovie.data.results.length - 1)
        ]
      );
    };

    fetchMovie();
  }, []);
  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };
  const showTrailer = (movie) => {
    if (trailerUrl) setTrailerUrl("");
    else {
      movieTrailer(
        movie?.name ||
          movie?.original_name ||
          movie?.title ||
          movie?.original_title ||
          ""
      )
        .then((url) => {
          if (url) {
            const urlParams = new URLSearchParams(new URL(url).search);
            setTrailerUrl(urlParams.get("v"));
          } else {
            error({
              title: "Movie Trailer Error",
              content:
                "Movie Trailer for " +
                (movie?.name ||
                  movie?.original_name ||
                  movie?.title ||
                  movie?.original_title) +
                " isn't found!",
            });
          }
        })
        .catch((error) => console.log(error));
    }
  };
  return (
    <>
      <header
        className="banner"
        style={{
          backgroundSize: "cover",
          backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie?.backdrop_path})`,
          backgroundPosition: "center center",
        }}
      >
        <div className="content">
          <div className="title">
            {movie?.title || movie?.name || movie?.original_name}
          </div>
          <div className="content_buttons">
            <button
              className="content_button"
              onClick={() => showTrailer(movie)}
            >
              {trailerUrl !== "" ? "Cancel" : "Play"}
            </button>
          </div>
          <p className="content_description">
            {truncate(movie?.overview, 150)}
          </p>
        </div>
        <div className="content_fadeBottom"></div>
      </header>

      {trailerUrl !== "" && <YouTube videoId={trailerUrl} opts={opts} />}
    </>
  );
};

export default Banner;
