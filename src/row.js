import React, { useEffect, useState } from "react";
import axios from "./axios";
import "./row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";
import { Modal } from "antd";

const basic_imageUrl = "https://image.tmdb.org/t/p/original/";
const Row = ({ title, fetchUrl, isLarge }) => {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [isLoading, setIsLoading] = useState({});
  const { error } = Modal;

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading({ title: true });
      const requests = await axios.get(fetchUrl);
      setMovies(requests.data.results);
      setIsLoading({ title: false });
    };

    fetchData();
  }, [fetchUrl]);

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
    <div className="row">
      <div className="title">{title}</div>
      <div className="row_container">
        {isLoading.title ? (
          <>...Loading</>
        ) : (
          <>
            {movies.map((movie) => {
              return (
                <img
                  key={movie.id}
                  className={`row_image ${isLarge && "row_large"}`}
                  onClick={() => showTrailer(movie)}
                  src={`${basic_imageUrl}${
                    isLarge ? movie.poster_path : movie.backdrop_path
                  }`}
                  alt={movie.name}
                />
              );
            })}
          </>
        )}
      </div>
      {trailerUrl !== "" && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
};

export default Row;
