import React, { PureComponent } from 'react';
import './App.css';

class App extends PureComponent {
  render() {
    const { q, loading, results, handleSearchChange } = this.props;
    return (
      <div className="App">
        <div>
          <input
            id="q"
            defaultValue={q}
            onChange={handleSearchChange}
          />
          {loading && '⏳'}
        </div>
        <ul id="results">
          {(results || []).map(volume => {
            const { id, link, thumbnail, title, authors, publisher } = volume;

            return (
              <li key={id}>
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
}

export default App;
