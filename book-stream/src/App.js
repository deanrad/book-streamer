import React, { PureComponent } from 'react';
import './App.css';

class App extends PureComponent {
  render() {
    const { q, loading, results } = this.props;
    return (
      <div className="App">
        <div>
          <input id="q" defaultValue={q} style={{ fontSize: '2em' }} />
          {loading && '⏳'}
        </div>
        <ul>
          {(results || []).map(volume => {
            const { id, link, thumbnail, title, authors, publisher } = volume;

            return (
              <li key={id}>
                <a href={link} target="_blank" rel="noopener noreferrer">
                  <img height="50" src={thumbnail} alt={title} />
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
