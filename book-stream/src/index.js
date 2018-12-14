import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import './index.css';
import App from './App';
import { agent } from 'antares-protocol';

let _state = {
  q: 'quilting',
  loading: false,
  results: []
};
const render = () => {
  ReactDOM.render(<App {..._state} />, document.getElementById('root'));
};

// ------------ Set up our consequences (HOW) ------------
agent.on('search/start', render);

// Log synchronously with a filter.
// Redux-lite-  manages our reduction (aggregation) of actions seen
const reduce = (state = _state, { type, payload }) => {
  switch (type) {
    case 'search/start':
      return { ...state, q: payload.q, loading: true, results: [] };
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
agent.filter(/^search/, ({ action }) => dispatchc(action));

// ------------ Trigger our events (WHAT) ----------
agent.process({ type: 'search/start', payload: { q: 'quilting' } });
