import React from "react";
import ReactDOM from "react-dom/client";

import HomePage from "./HomePage";
import "./fontawesome";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    //On a dû retirer le React. StrictMode pour des soucis de performance en effet ce mode nous render deux fois nos composants et donc doublait le nombre de rêquete serveur lié au useEffet, Source : https://stackoverflow.com/questions/48846289/why-is-my-react-component-is-rendering-twice
    <>
        <HomePage />
    </>
);
