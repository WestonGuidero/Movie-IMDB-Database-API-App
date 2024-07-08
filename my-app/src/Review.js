import React, { useState } from 'react';

function Review({ movie, onReviewSubmit }) {
  const [review, setReview] = useState('');

  const handleReviewChange = (event) => {
    setReview(event.target.value);
  };

  const handleReviewSubmit = (event) => {
    event.preventDefault();
    onReviewSubmit(review);
    setReview('');
  };

  return (
    <div>
      <h3>Review for {movie.title}</h3>
      <form onSubmit={handleReviewSubmit}>
        <textarea
          value={review}
          onChange={handleReviewChange}
          placeholder="Write your review here..."
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Review;