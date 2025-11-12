import express from "express"
import {games} from "./data/gamesData";
const app = express();
//..

// Middleware aktywny TYLKO dla ścieżek zaczynających się od /house
app.use("/house", (req, res, next) => {
    console.log("Middleware uruchomiony dla /house");
    next(); // przepuść dalej do właściwego endpointu
});

app.get("/house", (req, res) => {
    res.send("Witaj w domu!");
});

app.get("/garden", (req, res) => {
    res.json(games)
});