import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

describe('Startup', () => {
  it('should process a search/start action', () => {});
  it('should give the App a means to raise search/change events', () => {});
  it.skip('should subscribe to debounced search changes', () => {});
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
  });
  describe('search/result', () => {
    it('should add its payload to props.results', () => {});
  });
  describe('search/complete', () => {
    it('should merge the props with {loading: false}', () => {});
  });
});
