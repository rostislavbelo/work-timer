import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Layout } from "./Layout";
import { Header } from "./Header";

function App() {
  return (
    <Layout>
      <Header />
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Проект Помодоро!
      </p>
    </Layout>
  );
}

export default App;
