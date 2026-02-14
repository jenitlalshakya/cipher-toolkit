import './App.css';
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import VigenerePage from "./pages/VigenerePage";

function App() {
    const [mode, setMode] = useState("light");

    const toggleMode = () => {
        if (mode === "light") {
            setMode("dark");
            document.body.style.backgroundColor = "#121212";
            document.body.style.color = "white";
        } else {
            setMode("light");
            document.body.style.backgroundColor = "white";
            document.body.style.color = "black";
        }
    };

    return (
        <Router basename='/crypto-toolkit'>
            <Navbar title="Crypto ToolKit" mode={mode} toggleMode={toggleMode} />

            <Routes>
                <Route path="/" element={<VigenerePage />} />
                <Route path="/vigenere" element={<VigenerePage />} />
            </Routes>
        </Router>
    );
}

export default App;
