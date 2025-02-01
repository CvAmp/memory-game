import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Box, Card, CardContent, TextField } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles({
  card: {
    width: 100,
    height: 100,
    backgroundColor: "transparent!important",
    cursor: "pointer",
  },
  cardContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  motion: {
    width: "100%",
    height: "100%",
  },
});

const colors = [
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "orange",
  "pink",
  "cyan",
];
const generateTiles = () => {
  const values = [...colors, ...colors];
  return values
    .sort(() => Math.random() - 0.5)
    .map((color, index) => ({
      id: index,
      color,
      flipped: false,
      matched: false,
    }));
};

export default function MemoryGame() {
  const classes = useStyles();
  const [tiles, setTiles] = useState(generateTiles);
  const [selected, setSelected] = useState([]);
  const [player, setPlayer] = useState(1);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });

  const [player1Name, setPlayer1Name] = useState(null);
  const [player2Name, setPlayer2Name] = useState(null);

  useEffect(() => {
    if (selected.length !== 2) return;

    const [first, second] = selected;
    const isMatch = tiles[first].color === tiles[second].color;

    setTiles((prev) =>
      prev.map((tile) =>
        tile.id === first || tile.id === second
          ? { ...tile, matched: isMatch, flipped: isMatch || tile.flipped }
          : tile
      )
    );

    if (isMatch) {
      setScores((prev) => ({
        ...prev,
        [player === 1 ? "player1" : "player2"]:
          prev[player === 1 ? "player1" : "player2"] + 1,
      }));
    } else {
      setTimeout(() => {
        setTiles((prev) =>
          prev.map((tile) =>
            tile.id === first || tile.id === second
              ? { ...tile, flipped: false }
              : tile
          )
        );
      }, 1000);
    }

    setSelected([]);
    setPlayer((prev) => (prev === 1 ? 2 : 1));
  }, [selected]);

  const handleClick = (id) => {
    if (!player1Name || !player2Name) {
      alert("Please enter player names");
      return;
    }

    if (tiles[id].flipped || selected.length === 2) return;
    setTiles((prev) =>
      prev.map((tile) => (tile.id === id ? { ...tile, flipped: true } : tile))
    );
    setSelected([...selected, id]);
  };

  const resetGame = () => {
    setTiles(generateTiles());
    setSelected([]);
    setScores({ player1: 0, player2: 0 });
    setPlayer(1);
    setPlayer1Name(null);
    setPlayer2Name(null);
  };

  const setPlayer1NameHandler = (e) => {
    setPlayer1Name(e.target.value);
  };

  const setPlayer2NameHandler = (e) => {
    setPlayer2Name(e.target.value);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <h1 className="text-lg font-bold">Player {player}&apos;s Turn</h1>

      {/* 4x4 Grid for Tiles */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(4, 1fr)"
        gap={2}
        width={450}
      >
        {tiles.map((tile) => (
          <motion.div
            key={tile.id}
            animate={{ rotateY: tile.flipped || tile.matched ? 0 : 180 }}
            transition={{ duration: 0.5 }}
            className={classes.motion}
            style={{
              backgroundColor:
                tile.flipped || tile.matched ? tile.color : "gray",
            }}
          >
            <Card className={classes.card} onClick={() => handleClick(tile.id)}>
              <CardContent className={classes.cardContent}></CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>

      <Box display="flex" flexWrap="wrap" alignItems="center" gap={2}>
        <TextField
          type="text"
          label="Player 1 Name"
          variant="filled"
          placeholder="Player 1 Name"
          color="warning"
          onChange={setPlayer1NameHandler}
        />
        <TextField
          type="text"
          label="Player 2 Name"
          variant="filled"
          placeholder="Player 2 Name"
          color="warning"
          onChange={setPlayer2NameHandler}
        />
      </Box>

      <div className="flex gap-4 text-lg">
        <div>
          Player 1 {player1Name}: {scores.player1}
        </div>
        <div>
          Player 2 {player2Name}: {scores.player2}
        </div>
      </div>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={resetGame}
      >
        Reset Game
      </button>
    </Box>
  );
}