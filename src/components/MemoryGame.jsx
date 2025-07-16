import React, { useState, useEffect } from "react";
import '../components/MemoryGame.css';

const generateCards = () => {
  const nums = [1, 2, 3, 4, 5, 6]; // or any other array of numbers
  const cards = [...nums, ...nums]; // duplicate the array
  for (let i = cards.length - 1; i > 0; i--) {
    // Fisher-Yates shuffle
    const j = Math.floor(Math.random() * (i + 1)); // generate a random index
    [cards[i], cards[j]] = [cards[j], cards[i]]; // swap elements
  }
  return cards.map((num, index) => ({
    // transform the array into objects
    id: index, // assign a unique id to each object
    value: num, // assign the value to each object
    isFlipped: false, // initialize the isFlipped property to false
    isMatched: false, // initialize the isMatched property to false
  }));
};

const MemoryGame = () => {
  const [cards, setCards] = useState(generateCards()); // initialize the cards state with the generated cards
  const [flipped, setFlipped] = useState([]); // initialize the flipped state to an empty array
  const [matchedCount, setMatchedCount] = useState(0); // initialize the matchedCount state to 0
  const [startTime, setStartTime] = useState(Date.now()); // initialize the startTime state to the current time
  const [bestTime, setBestTime] = useState(
    () => localStorage.getItem("bestTime") || null
  ); // initialize the bestTime state to the best time from local storage or null
  const [gameOver, setGameOver] = useState(false); // initialize the gameOver state to false

  const handleClick = (index) => {
    if (gameOver) return; // if the game is over, do nothing

    const newCards = [...cards]; // create a copy of the cards state
    const clickedCard = newCards[index]; // get the clicked card

    if (clickedCard.isFlipped || clickedCard.isMatched || flipped.length === 2)
      return; // if the card is already flipped or matched or two cards are already flipped, do nothing

    clickedCard.isFlipped = true; // flip the card
    const newFlipped = [...flipped, index]; // add the index to the flipped array
    setCards(newCards); // update the cards state
    setFlipped(newFlipped); // update the flipped state

    if (newFlipped.length === 2) {
      // if two cards are flipped
      const [firstIdx, secondIdx] = newFlipped; // get the indices of the two flipped cards
      if (newCards[firstIdx].value === newCards[secondIdx].value) {
        // if the two cards match
        newCards[firstIdx].isMatched = true; // mark the first card as matched
        newCards[secondIdx].isMatched = true; // mark the second card as matched
        setCards(newCards); // update the cards state
        setMatchedCount((prev) => prev + 1); // increment the matchedCount state
        setFlipped([]); // reset the flipped state
      } else {
        setTimeout(() => {
          newCards[firstIdx].isFlipped = false; // unflip the first card
          newCards[secondIdx].isFlipped = false; // unflip the second card
          setCards([...newCards]); // update the cards state
          setFlipped([]); // reset the flipped state
        }, 1000);
      }
    }
  };

  const restartGame = () => {
    setCards(generateCards());
    setMatchedCount(0);
    setFlipped([]);
    setStartTime(Date.now());
    setGameOver(false);
  };

  useEffect(() => {
    if (matchedCount === 6) {
      // if all cards are matched
      const endTime = Date.now(); // get the current time
      const timeTaken = Math.floor((endTime - startTime) / 1000); // calculate the time taken in seconds

      if (!bestTime || timeTaken < bestTime) {
        // if the best time is null or the current time is less than the best time
        localStorage.setItem("bestTime", timeTaken); // update the best time in local storage
        setBestTime(timeTaken); // update the bestTime state
      }

      // Trigger game over effect
      setGameOver(true);

      // Restart game after 2 seconds
      setTimeout(() => {
        restartGame();
      }, 2000);
    }
  }, [matchedCount]);

  return (
    <div
      style={{
        textAlign: "center",
        fontFamily: "sans-serif",
        backgroundColor: gameOver ? "#4CAF50" : "#F0FFFF",
        color: gameOver ? "black" : "inherit",
        minHeight: "100vh",
        transition: "all 0.3s ease",
        paddingTop: "30px",
      }}
    >
      <h1
        className="game-title"
        style={{
          textAlign: "center",
          fontSize: "2.5rem",
          fontWeight: "bold",
          color: "#82b4e3ff",
          textShadow: "1px 1px 4px rgba(0,0,0,0.2)",
          marginBottom: "1rem",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        MindMatch 🧠✨
      </h1>

      <h4>Match all pairs as fast as you can!</h4>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 80px)",
          gap: "10px",
          justifyContent: "center",
        }}
      >
        {cards.map((card, index) => (
          <div
            style={{
                cursor:'pointer'
            }}
            key={card.id}
            className="card-container"
            onClick={() => handleClick(index)}
          >
            <div
              className={`card-inner ${
                card.isFlipped || card.isMatched ? "flipped" : ""
              }`}
            >
              <div className="card-front">{card.value}</div>
              <div className="card-back">🐾</div>
            </div>
          </div>
        ))}
      </div>

      <br />

      <button
        onClick={restartGame}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#2196F3",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "10px",
        }}
      >
        Restart Game
      </button>

      <br />
      <h5>Matched Pairs: {matchedCount} / 6</h5>
      {bestTime && <h3>🏆 MindMatch Record ⏱️: {bestTime} seconds</h3>}
      {gameOver && <h2>🎉 You Won!</h2>}
    </div>
  );
};

export default MemoryGame;
