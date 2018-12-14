import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

/* These are an outline of tests that would best work as integration tests
   but are placed here just to track the growth of features.

   A framework based on Observables poses interesting challenges and opportunities
   in the realm of testing!
*/
describe('Startup', () => {
  it('should process a search/start action', () => {});
  it('should give the App a means to raise search/change events', () => {});
  it('should subscribe to debounced search changes', () => {});
});
describe('Consequences', () => {
  describe('search/*', () => {
    it('should cause re-rendering', () => {});
    it('should filter through a reducer', () => {});
  });
  describe('search/start', () => {
    it('should merge the props with {q, loading: true, results: []}', () => {});
    it('should call the API, processing search/result for each item under "items"', () => {});
    it('should process search/complete', () => {});
    it.skip('should cancel a previous search in progress', () => {
      /* this partially works, but because of the debounced search, some edge cases may show through */
    });
  });
  describe('search/result', () => {
    it('should add its payload to props.results', () => {});
  });
  describe('search/complete', () => {
    it('should merge the props with {loading: false}', () => {});
  });
});
