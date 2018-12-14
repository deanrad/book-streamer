import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

const _state = {
  q: "quilting",
  loading: false,
  results: []
};
const render = () => {
  ReactDOM.render(<App {..._state} />, document.getElementById("root"));
};

render();
