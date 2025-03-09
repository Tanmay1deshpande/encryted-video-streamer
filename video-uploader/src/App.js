import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from 'react-redux';
import Home from "./pages/Home";
import Player from "./pages/Player";
import store from "./store/Store";

function App() {
  return (
    <>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/player" element={<Player />} />
          </Routes>
        </Router>
      </Provider>
    </>
  );
}

export default App;
