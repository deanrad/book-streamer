import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import './index.css';
import { App } from './App';
import { trigger, listen, filter, after, query } from 'polyrhythm';
import { map, tap, endWith, mergeMap, first, catchError } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { of, from, Observable } from 'rxjs';

const defaultQuery = document.location.hash.substr(1) || 'polyrhythm';
let _state = {
  q: defaultQuery,
  spinner: null,
  results: []
};

// const url = 'https://www.googleapis.com/books/v1/volumes?q=';
const url = 'https://untitled-bk05rn8eijyx.runkit.sh/?q=';
// const getBooks = nonCancelableGet;
// const getBooks = nonStreamingGet;
const getBooks = streamingGet;

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
      return { ...state, q: payload.q, spinner: '⏳' };
    case 'search/clear':
      return { ...state, spinner: null, results: [] };
    case 'search/result':
      return { ...state, results: [...state.results, payload] };
    case 'search/error':
      return { ...state, spinner: '💥' };
    case 'search/complete':
      return { ...state, spinner: null };
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

listen(
  'search/change',
  ({ payload: { q } }) => {
    return after(700, () => trigger('search/start', { q }));
  },
  { mode: 'replace' }
);

listen('search/start', updateAddressBar);
listen('search/start', clearOnFirstResult, { mode: 'replace' });
// prettier-ignore
listen('search/start', getAjaxBooks, { mode: 'replace'});

listen(/^search/, render);

// ------------ START OFF WITH A SEARCH --------------
trigger('search/start', { q: defaultQuery });

// ------------ Implementation Details --------------

function getAjaxBooks({ payload }) {
  const { q } = payload;
  return getBooks(q).pipe(
    map(volume => ({
      type: 'search/result',
      payload: volumeToPayload(volume)
    })),
    endWith({ type: 'search/complete' }),
    catchError(() => {
      return of({ type: 'search/error' });
      //return failed
    }),
    tap(({ type, payload }) => trigger(type, payload))
  );
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
    try {
      let response = await fetch(url + q);
      let items = (await response.json()).items;
      for (let item of items) {
        notify.next(item);
      }
      notify.complete();
    } catch (ex) {
      notify.error(ex);
    }
  });
}

function updateAddressBar(event) {
  document.location.hash = event.payload.q;
}

function clearOnFirstResult() {
  return query('search/result').pipe(
    first(),
    tap(() => trigger('search/clear'))
  );
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
