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
  it.skip('should subscribe to debounced search changes', () => {});
});
describe('Consequences', () => {
  describe('search/*', () => {
    it('should cause re-rendering', () => {});
    it('should filter through a reducer', () => {});
  });
  describe('search/start', () => {
    it('should merge the props with {q, loading: true, results: []}', () => {});
  });
  describe('search/complete', () => {
    it('should merge the props with {loading: false}', () => {});
  });
});
