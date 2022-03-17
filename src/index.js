//React + Pkgs
import { StrictMode } from "react";
import ReactDOM from "react-dom";

//Components
import App from "./App";

//Styles
import "./App.scss";

//Nunjucks
import "./pages/index.nunjucks";
import "./pages/another-page.nunjucks";
import "./pages/some-other-page.nunjucks";

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById("root")
);
