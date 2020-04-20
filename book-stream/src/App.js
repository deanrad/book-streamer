import React from 'react';
import { randomId } from 'polyrhythm';
import './App.css';

export function App({ q, spinner, results, handleSearchChange }) {
  return (
    <div className="App">
      <div>
        <input id="q" defaultValue={q} onChange={handleSearchChange} />
        <span id="spinner">{spinner}</span>
      </div>
      <ul id="results">
        {(results || []).map(volume => {
          const { link, thumbnail, title, authors, publisher } = volume;

          return (
            <li key={randomId()}>
              <img height="50" src={thumbnail} alt={title} />
              <a href={link} target="_blank" rel="noopener noreferrer">
                {title} - {authors} - {publisher}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
