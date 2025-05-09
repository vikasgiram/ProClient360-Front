import React from 'react';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <img
        src="/static/assets/img/NotFound/NotFound404.gif"
        alt="Not Found"
        className="not-found-image"
      />
      <div className="not-found-text">
        <h1>404</h1>
        <h2>Oops! Page Not Found</h2>
        <p>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <a href="/" className="btn btn-outline-success btn-rounded">
            Go Back Home 
        </a>
      </div>
    </div>
  );
};

export default NotFound;
