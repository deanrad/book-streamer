import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import './index.css';
import App from './App';
import { trigger, listen, filter, after } from 'polyrhythm';
import { map, tap, filter as _filter, endWith, mergeMap } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { from, Observable } from 'rxjs';

let _state = {
  q: 'polyrhythm',
  loading: false,
  results: []
};

// const url = 'https://www.googleapis.com/books/v1/volumes?q=';
const url = 'https://untitled-bk05rn8eijyx.runkit.sh/?q=';
// const getBooks = nonCancelableGet;
const getBooks = nonStreamingGet;
// const getBooks = streamingGet;

const handleSearchChange = e => {
  trigger('search/change', {
    q: e.target.value
  });
};
const render = () => {
  ReactDOM.render(
    <App {...store.getState()} handleSearchChange={handleSearchChange} />,
    document.getElementById('root')
  );
};

// Log synchronously with a filter.
// Redux-lite-  manages our reduction (aggregation) of events seen
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

// Redux/ReduxDevTools sees all events as actions
const dispatch = event => {
  store.dispatch(event);
};
filter(/^search/, dispatch);
listen('search/start', updateAddressBar);

listen(
  'search/change',
  ({ payload: { q } }) => {
    return after(700, () => trigger('search/start', { q }));
  },
  { mode: 'replace' }
);

// prettier-ignore
listen('search/start', ({ payload: { q }}) => {
  return getBooks(q).pipe(
    map(volume => ({ type: 'search/result', payload: volumeToPayload(volume)})),
    endWith({ type: 'search/complete' }),
    tap(({ type, payload }) => trigger(type, payload))
  )
}, { mode: 'replace'});

listen(/^search/, render);

// ------------ START OFF WITH A SEARCH --------------
trigger('search/start', { q: 'polyrhythm' });

// ------------ Implementation Details --------------
function updateAddressBar(event) {
  document.location.hash = event.payload.q;
}

function nonStreamingGet(q) {
  return ajax
    .get(url + q)
    .pipe(mergeMap(({ response }) => from(response.items)));
}

function streamingGet(q) {
  return new Observable(notify => {
    // eslint-disable-next-line
    oboe(url + q)
      .node('items[*]', function(item) {
        notify.next(item);
      })
      .fail(ex => notify.error(ex))
      .done(() => notify.complete());
  });
}

// A Promise-based execution, returned
function nonCancelableGet(q) {
  return new Observable(async notify => {
    let response = await fetch(url + q);
    let items = (await response.json()).items;
    for (let item of items) {
      notify.next(item);
    }
    notify.complete();
  });
}

function volumeToPayload(volume) {
  const id = volume.id;
  const info = volume.volumeInfo || {};
  const { title, publisher, canonicalVolumeLink: link } = info;
  const authors = (info.authors || []).join(', ');
  const { smallThumbnail: thumbnail } = info.imageLinks || {};
  return {
    id,
    title,
    authors,
    link,
    publisher,
    thumbnail
  };
}
