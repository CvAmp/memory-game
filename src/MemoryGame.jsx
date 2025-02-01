import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@mui/material";

const colors = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "cyan"];
const generateTiles = () => {
  const values = [...colors, ...colors];
  return values.sort(() => Math.random() - 0.5).map((color, index) => ({
    id: index,
    color,
    flipped: false,
    matched: false,
  }));
};

export default function MemoryGame() {
  const [tiles, setTiles] = useState(generateTiles);
  const [selected, setSelected] = useState([]);
  const [player, setPlayer] = useState(1);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });

  useEffect(() => {
    if (selected.length !== 2) return;

    const [first, second] = selected;
    const isMatch = tiles[first].color === tiles[second].color;

    setTiles(prev =>
      prev.map(tile =>
        tile.id === first || tile.id === second
          ? { ...tile, matched: isMatch, flipped: isMatch || tile.flipped }
          : tile
      )
    );

    if (isMatch) {
      setScores(prev => ({
        ...prev,
        [player === 1 ? "player1" : "player2"]: prev[player === 1 ? "player1" : "player2"] + 1,
      }));
    } else {
      setTimeout(() => {
        setTiles(prev =>
          prev.map(tile =>
            tile.id === first || tile.id === second ? { ...tile, flipped: false } : tile
          )
        );
      }, 1000);
    }

    setSelected([]);
    setPlayer(prev => (prev === 1 ? 2 : 1));
  }, [selected]);

  const handleClick = id => {
    if (tiles[id].flipped || selected.length === 2) return;
    setTiles(prev => prev.map(tile => (tile.id === id ? { ...tile, flipped: true } : tile)));
    setSelected([...selected, id]);
  };

  const resetGame = () => {
    setTiles(generateTiles());
    setSelected([]);
    setScores({ player1: 0, player2: 0 });
    setPlayer(1);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-lg font-bold">Player {player}'s Turn</h1>
      <div className="grid grid-cols-4 gap-2">
      {tiles.map(tile => (
          <Card key={tile.id} className="w-16 h-16" onClick={() => handleClick(tile.id)}>
            <CardContent className="flex items-center justify-center h-full">
              <motion.div
                animate={{ rotateY: tile.flipped || tile.matched ? 0 : 180 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full rounded"
                style={{ backgroundColor: tile.flipped || tile.matched ? tile.color : "gray" }}
              >
              </motion.div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex gap-4 text-lg">
        <div>Player 1: {scores.player1}</div>
        <div>Player 2: {scores.player2}</div>
      </div>
      <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={resetGame}>
        Reset Game
      </button>
    </div>
  );
}
