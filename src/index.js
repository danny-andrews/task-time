import { createElement } from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import "./index.css";
import "./shared/polyfills";

ReactDOM.render(createElement(App), document.getElementById("root"));
