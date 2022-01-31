import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Navigate } from "react-router-dom";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './index.css';

import Header from "./Header";

import CLogic from "./CLogic";
import reportWebVitals from './reportWebVitals';

let cLogicInstance = new CLogic();
(globalThis as any).cLogic = cLogicInstance;

let extDOM;
let readStatus = cLogicInstance.readData();
switch (readStatus) {
  case "ENCRYPTED":
    extDOM = (
      <Navigate to="/encrypted" />
    )
    break;
  case "MALFORMED":
    
}

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Header />
      {extDOM}
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
