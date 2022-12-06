import React from 'react';
import WebFont from "webfontloader";
import './App.css';
import Header from "./component/layout/Header/Header.js";
import { BrowserRouter as Router } from "react-router-dom";
import Footer from './component/layout/Footer/Footer';

function App() {
  React.useEffect(() => {
    WebFont.load({
      google: {
        families: ['Roboto', 'Droid Sans', 'Chilanka']
      }
    })
  }, []);

  return (
    <Router>
        <Header />
        <Footer />
    </Router>

  );
}

export default App;
