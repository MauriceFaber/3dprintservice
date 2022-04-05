import TestViewer from "./components/TestViewer";
import Demo from "./components/Demo";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import AboutUs from "./components/AboutUs/AboutUs";
import ErrorPage from "./components/ErrorPages/ErrorPage";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="mainDiv">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route
            path="/configurator"
            element={
              <>
                <div className="relContainer">
                  <Demo />
                </div>
                <TestViewer />
              </>
            }
          />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
