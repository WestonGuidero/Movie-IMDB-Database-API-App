import React, { useState, useEffect } from 'react';
import './App.css';
import ReactStars from 'react-stars';

function App() {
  const [ratings, setRatings] = useState({});
  const [reviews, setReviews] = useState({});
  const [endPoint, setEndPoint] = useState("");
  const [container, setContainer] = useState([]);
  const [error, setError] = useState(null);

  const fetchMovies = async () => {
    try {
      const response = await fetch(`http://localhost:8000/movies?q=${endPoint}`);
      const data = await response.json();
      console.log('Fetched data:', data);
      if (Array.isArray(data)) {
        setContainer(data);
        setError(null);
      } else {
        console.error('Expected an array but received:', data);
        setContainer([]);
        setError(data.error || 'Unexpected response format');
      }
    } catch (error) {
      console.error('Error fetching movie data:', error);
      setError('Error fetching movie data');
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [endPoint]);

  const handleInputChange = (event) => {
    setEndPoint(event.target.value);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    fetchMovies();
  };

  const ratingChanged = (newRating, movieId) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [movieId]: newRating,
    }));
  };

  const handleReviewSubmit = (event, movieId) => {
    event.preventDefault();
    const reviewText = event.target.elements.review.value;
    setReviews((prevReviews) => ({
      ...prevReviews,
      [movieId]: reviewText,
    }));
    event.target.elements.review.value = '';
  };

  return (
    <div className="App">
      <input
        type="text"
        value={endPoint}
        onChange={handleInputChange}
      />
      <button onClick={onSubmitHandler}>Submit</button>
      {error && <div className="error-message">{error}</div>}
      <div className="element">
        {Array.isArray(container) && container.map((item) => (
          <div key={item.id} className='element-div'>
            <h2>{item.l}</h2>
            {item.i && item.i.imageUrl && (
              <div>
                <p><img src={item.i.imageUrl} alt="" id={`image-${item.id}`} /></p>
                <p>{item.s}</p>
                <div>
                  <ReactStars
                    count={5}
                    value={ratings[item.id] || 0}
                    onChange={(newRating) => ratingChanged(newRating, item.id)}
                    size={24}
                    color2={'#ffd700'}
                  />
                  {ratings[item.id] > 0 && (
                    <div>
                      <h3>Rating: {ratings[item.id]}</h3>
                    </div>
                  )}
                </div>
                <form onSubmit={(e) => handleReviewSubmit(e, item.id)} className="review-form">
                  <label>
                    Review:
                    <input type="text" name="review" className="review-text" />
                  </label>
                  <button type="submit">Submit Review</button>
                </form>
                {reviews[item.id] && (
                  <div>
                    <h4>Review:</h4>
                    <p>{reviews[item.id]}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
