import "normalize.css/normalize.css";
import "./App.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import {
  BrowserRouter as Router,
} from "react-router-dom";
import { style } from "typestyle";
import { Colors } from "@blueprintjs/core";
import { RecoilRoot } from "recoil";
import { DemoPage } from "./Views/DemoPage";


function App() {
  return (
    <RecoilRoot>
      <Router>
        <div className={appStyle}>
          <DemoPage />
        </div>
      </Router>
    </RecoilRoot>
  );
}

const appStyle = style({
  display: "flex",
  height: "100%",
  width: "100%",
  backgroundColor: Colors.DARK_GRAY1,
});

export default App;
