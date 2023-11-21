import { useCallback, useEffect, useRef } from "react";
import axios from "axios";
import search_icon from "../assets/search.png";
import { useState } from "react";
import "../styles/searchengine.css";

const API_URL = `https://api.unsplash.com/search/photos`;
const IMAGES_PER_PAGE = 27;

const Searchengine = () => {
  // console.log("key", import.meta.env.VITE_API_KEY);
  const [images, setImages] = useState([]);
  const [page, setpage] = useState(1);
  const [totalpages, setTotalpages] = useState(0);
  const searchInput = useRef(null);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchImages = useCallback(async () => {
    try {
      if (searchInput.current.value) {
        setErrorMsg("");
        const { data } = await axios.get(
          `${API_URL}?query=${
            searchInput.current.value
          }&page=${page}&per_page=${IMAGES_PER_PAGE}&client_id=${
            import.meta.env.VITE_API_KEY
          }`
        );
        setImages(data.results);
        setTotalpages(data.total_pages);
        console.log(data);
      }
    } catch (error) {
      setErrorMsg("error in fetching images. try again later");
      console.log(error);
    }
  }, [page]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const resetPage = () => {
    fetchImages();
    setpage(1);
  };

  // const url = `https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=${api_key}&per_page=14`;
  const searchfunc = (e) => {
    e.preventDefault();
    resetPage();
  };

  const handleSelection = (selection) => {
    searchInput.current.value = selection;
    resetPage();
  };

  return (
    <header>
      <h1>welcome to pictosearch</h1>
      {errorMsg && <p className="error-message">{errorMsg}</p>}
      <form className="header" onSubmit={searchfunc}>
        <input
          type="text"
          placeholder="Search your picture here"
          className="search-input"
          required
          ref={searchInput}
        />
        <button type="submit" className="search-icon">
          <img src={search_icon} alt="search-icon" />
        </button>
      </form>
      <div className="filters">
        <div className="recommended" onClick={() => handleSelection("cars")}>
          cars
        </div>
        <div className="recommended" onClick={() => handleSelection("birds")}>
          birds
        </div>
        <div className="recommended" onClick={() => handleSelection("nature")}>
          nature
        </div>
        <div className="recommended" onClick={() => handleSelection("road")}>
          road
        </div>
      </div>
      <div id="images">
        {images.map((image) => {
          return (
            <img
              key={image.id}
              src={image.urls.small}
              alt={image.alt_discription}
              className="image"
            />
          );
        })}
      </div>
      <div className="buttons">
        {page > 1 && (
          <button onClick={() => setpage(page - 1)}>Previous</button>
        )}
        {page < totalpages && (
          <button onClick={() => setpage(page + 1)}>Next</button>
        )}
      </div>
    </header>
  );
};

export default Searchengine;
