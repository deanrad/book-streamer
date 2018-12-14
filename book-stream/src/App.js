import React, { PureComponent } from "react";
import logo from "./logo.svg";
import "./App.css";

class App extends PureComponent {
  render() {
    const { q, loading, results } = this.props;
    return (
      <div className="App">
        <div>
          <input id="q" defaultValue={q} style={{ fontSize: "2em" }} />
          {loading && "⏳"}
        </div>
        <ul>
          {(results || []).map(volume => {
            const info = volume.volumeInfo || {};
            const { title, publisher, canonicalVolumeLink: link } = info;
            const thumb = (info.imageLinks || {}).smallThumbnail;
            const authors = (info.authors || []).join(", ");

            return (
              <li>
                <a href={link} target="_blank" rel="noopener">
                  <img height="50" src={thumb} alt={title} />
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
