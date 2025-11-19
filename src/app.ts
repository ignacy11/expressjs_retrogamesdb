import express, {Request, Response} from "express"
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

app.get("/games", (req: Request, res: Response) => {
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
app.get("games/:id", (req: Request, res: Response) => {
    const game = games.find(game => game.id === Number(req.params.id))
    if(!game) return res.status(404).send("No game found.")
    res.json(game)
})

app.post("/games", (req: Request, res: Response) => {
    console.log(req.body) // w konsoli podglądamy wartość po działaniu express.json()
    try {
        const {title, year, platform, genre} = req.body;

        if (!title || !year || !platform || !genre) {
            return res.status(400).json({message: "Missing required fields"});
        }

        const newGame: Game = {
            id: Date.now(),
            title,
            year,
            platform,
            genre,
        };

        games.push(newGame); // dodajemy do naszej listy jakby bazy danych
        res.status(201).json(newGame); // zwracamy nowy obiekt z kodem 201
    } catch(error){
        if(error instanceof Error){
            res.status(500).json({message: error.message});
        } else{
            console.error(error);
        }
    }
})

app.put("/games/:id", (req: Request, res: Response) => { // to jest jakby update ale
    try {
        const id = Number(req.params.id); // parsowanie id: string -> id: int
        const index = games.findIndex(g => g.id === id); // przechodzi po kolekcji gier i zwraca index albo -1
        if (index === -1) return res.status(404).send("Game not found"); // oznajmia, że nie znalezionio gry i należy zakończyć połączenie z serwerem

        games[index] = { id, ...req.body }; // nadpisujemy obiekt gry, pozostawiamy id bez zmian
        res.json(games[index]);
    } catch (error) {
        console.error("Błąd aktualizacji gry:", error); // Log do konsoli
        res.status(500).json({ message: "Wewnętrzny błąd serwera" }); // Odpowiedź dla klienta
    }
});