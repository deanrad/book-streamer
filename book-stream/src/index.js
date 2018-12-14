import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import './index.css';
import App from './App';
import { agent, after, ajaxStreamingGet } from 'antares-protocol';
import { map, filter, endWith, concatMap, debounceTime } from 'rxjs/operators';

let _state = {
  q: 'quilting',
  loading: false,
  results: []
};

const handleSearchChange = e => {
  agent.process({
    type: 'search/change',
    payload: {
      q: e.target.value
    }
  });
};
const render = () => {
  ReactDOM.render(
    <App {..._state} handleSearchChange={handleSearchChange} />,
    document.getElementById('root')
  );
};

// ------------ Set up our consequences (HOW) ------------
agent.on(/^search/, render);

// Log synchronously with a filter.
// Redux-lite-  manages our reduction (aggregation) of actions seen
const reduce = (state = _state, { type, payload }) => {
  switch (type) {
    case 'search/start':
      return { ...state, q: payload.q, loading: true, results: [] };
    case 'search/result':
      return { ...state, results: [...state.results, payload] };
    case 'search/complete':
      return { ...state, loading: false };
    default:
      return state;
  }
};
const store = createStore(
  reduce,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
const dispatch = action => {
  store.dispatch(action);
  _state = store.getState();
  return _state;
};
agent.filter(/^search/, ({ action }) => dispatch(action));
// prettier-ignore
agent.on('search/start', ({ action }) => {
    return ajaxStreamingGet({
      url: 'https://www.googleapis.com/books/v1/volumes?q=' + action.payload.q,
      expandKey: 'items'
    }).pipe(
      map(volume => {
        const id = volume.id
        const info = volume.volumeInfo || {};
        const { title, publisher, canonicalVolumeLink: link } = info;
        const authors = (info.authors || []).join(', ');
        const { smallThumbnail: thumbnail } = info.imageLinks || {};
        return {
          type: 'search/result',
          payload: {
            id,
            title,
            authors,
            link,
            publisher,
            thumbnail
          }
        };
      }),
      concatMap(action => after(500, () => action)),
      endWith({
        type: 'search/complete'
      })
    );
  },
  { processResults: true }
);
// ------------ Trigger our events (WHAT) ----------
agent.process({ type: 'search/start', payload: { q: 'quilting' } });

agent.subscribe(
  agent.allOfType('search/change').pipe(
    filter(action => (action.payload.q || '').length > 2),
    debounceTime(700),
    map(action => ({
      type: 'search/start',
      payload: { q: action.payload.q }
    }))
  )
);
