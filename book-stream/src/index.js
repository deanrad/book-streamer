import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { agent } from "antares-protocol";

const _state = {
  q: "quilting",
  loading: false,
  results: []
};
const render = () => {
  ReactDOM.render(<App {..._state} />, document.getElementById("root"));
};

// ------------ Set up our consequences (HOW) ------------
agent.on("search/start", render);

// Log synchronously with a filter.
// TODO filter through a reducer.
agent.filter(/^search/, ({ action }) => console.log(action));

// ------------ Trigger our events (WHAT) ----------
agent.process({ type: "search/start", payload: { q: "quilting" } });
