import express from "express"
import {games} from "./data/gamesData";
import {Game} from "./models/game";
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

app.get("/games", (req: express.Request, res: express.Response) => {
    const {year, platform} = req.query

    if(!year || !platform) res.json(games)
    const filteredGames = games.filter(g => {
        if(year && g.year > Number(year)) return false

        if(platform) {
            if(typeof platform === "string") {
                const queryPlatform = platform.toLowerCase()
                const gamePlatform = g.platform.toLowerCase()
                if(!gamePlatform.includes(queryPlatform)) return false
            }
        }
        return false
        })
        res.json(filteredGames)
    }
)

// route parameter
app.get("games/:id", (req: express.Request, res: express.Response) => {
    const game = games.find(game => game.id === Number(req.params.id))
    if(!game) return res.status(404).send("No game found.")
    res.json(game)
})

app.post("/games", (req: express.Request, res: express.Response) =>
    console.log(req.body)
    // TODO
)