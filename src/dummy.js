// /* eslint-disable react-hooks/exhaustive-deps */
// import { useState, useEffect, useCallback, useRef } from "react";
// import { ROWS, COLUMNS, TETROMINOS, COLORS } from "./Constant";
// import { FaRegCirclePlay, FaArrowRightLong, FaLeftLong } from "react-icons/fa6";
// import {
//   FaRegPauseCircle,
//   FaLongArrowAltUp,
//   FaLongArrowAltDown,
// } from "react-icons/fa";
// import { GrPowerReset, GrResume } from "react-icons/gr";
// import { BsFillInfoCircleFill } from "react-icons/bs";
// import { MdOutlineClose } from "react-icons/md";
// function Tetris() {
//   const [board, setBoard] = useState(createEmptyBoard());
//   const [currentPiece, setCurrentPiece] = useState(null);
//   const [nextPiece, setNextPiece] = useState(randomPiece());
//   const [score, setScore] = useState(0);
//   const [level, setLevel] = useState(1);
//   const [clearedLines, setClearedLines] = useState([]);
//   const [recentScores, setRecentScores] = useState([]);
//   const [isPaused, setIsPaused] = useState(false);
//   const [isGameOver, setIsGameOver] = useState(false);
//   const [showHowToPlay, setShowHowToPlay] = useState(false);
//   const [showRecentScores, setShowRecentScores] = useState(false);
//   const [countdown, setCountdown] = useState(0);
//   const [gameStarted, setGameStarted] = useState(false);
//   const intervalRef = useRef(null);
//   const moveDown = useCallback(() => {
//     if (!currentPiece) return;
//     const newY = currentPiece.y + 1;
//     if (!collision(currentPiece.shape, currentPiece.x, newY)) {
//       setCurrentPiece((prev) => ({ ...prev, y: newY }));
//     } else {
//       const mergedBoard = mergePiece(board, currentPiece);
//       const { linesCleared, clearedBoard } = clearLines(mergedBoard);
//       setBoard(clearedBoard);
//       setScore((s) => s + linesCleared * 10);
//       setLevel((l) => l + Math.floor(linesCleared / 10));
//       if (currentPiece.y === 0) {
//         setIsGameOver(true);
//         setRecentScores((prev) => [score, ...prev].slice(0, 5));
//         return;
//       }
//       setCurrentPiece(nextPiece);
//       setNextPiece(randomPiece());
//     }
//   }, [board, currentPiece, nextPiece]);
//   useEffect(() => {
//     if (!isPaused && !isGameOver) {
//       clearInterval(intervalRef.current);
//       intervalRef.current = setInterval(
//         moveDown,
//         Math.max(1000 - level * 100, 100)
//       );
//     } else {
//       clearInterval(intervalRef.current);
//     }
//     return () => clearInterval(intervalRef.current);
//   }, [moveDown, isPaused, level, isGameOver]);
//   useEffect(() => {
//     return () => clearInterval(intervalRef.current);
//   }, []);
//   function createEmptyBoard() {
//     return Array.from({ length: ROWS }, () => Array(COLUMNS).fill(0));
//   }
//   function randomPiece() {
//     const keys = Object.keys(TETROMINOS);
//     const key = keys[Math.floor(Math.random() * keys.length)];
//     const shape = TETROMINOS[key];
//     return {
//       shape,
//       x: Math.floor((COLUMNS - shape[0].length) / 2),
//       y: 0,
//       color: COLORS[key],
//     };
//   }
//   const startCountdown = (callback, duration = 3) => {
//     setCountdown(duration);
//     const timer = setInterval(() => {
//       setCountdown((prev) => {
//         if (prev === 1) {
//           clearInterval(timer);
//           setTimeout(() => {
//             setCountdown(0);
//             if (callback) callback();
//           }, 300);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//   };
//   const startGame = () => {
//     startCountdown(() => {
//       setBoard(createEmptyBoard());
//       const newPiece = randomPiece();
//       const upcoming = randomPiece();
//       setCurrentPiece(newPiece);
//       setNextPiece(upcoming);
//       setScore(0);
//       setLevel(1);
//       setClearedLines([]);
//       setRecentScores([]);
//       setIsPaused(false);
//       setIsGameOver(false);
//       setGameStarted(true);
//     });
//   };
//   const resumeGame = () => {
//     startCountdown(() => {
//       setIsPaused(false);
//     });
//   };
//   const pauseGame = () => {
//     setIsPaused(true);
//     clearInterval(intervalRef.current);
//   };
//   function collision(shape, x, y) {
//     for (let dy = 0; dy < shape.length; dy++) {
//       for (let dx = 0; dx < shape[dy].length; dx++) {
//         if (shape[dy][dx]) {
//           let boardY = y + dy;
//           let boardX = x + dx;
//           if (
//             boardX < 0 ||
//             boardX >= COLUMNS ||
//             boardY >= ROWS ||
//             (boardY >= 0 && board[boardY]?.[boardX])
//           ) {
//             return true;
//           }
//         }
//       }
//     }
//     return false;
//   }
//   function mergePiece(board, piece) {
//     const newBoard = board.map((row) => [...row]);
//     piece.shape.forEach((row, dy) => {
//       row.forEach((value, dx) => {
//         if (
//           value &&
//           newBoard[piece.y + dy] &&
//           newBoard[piece.y + dy][piece.x + dx] !== undefined
//         ) {
//           newBoard[piece.y + dy][piece.x + dx] = piece.color;
//         }
//       });
//     });
//     return newBoard;
//   }
//   function clearLines(tempBoard) {
//     let linesCleared = 0;
//     const newBoard = [...tempBoard];
//     for (let y = ROWS - 1; y >= 0; y--) {
//       if (newBoard[y].every((cell) => cell !== 0)) {
//         linesCleared++;
//         setClearedLines((prev) => [...prev, y]);
//         setTimeout(() => {
//           setClearedLines((prev) => prev.filter((line) => line !== y));
//         }, 300);
//         newBoard.splice(y, 1);
//         newBoard.unshift(Array(COLUMNS).fill(0));
//         y++;
//       }
//     }
//     return { linesCleared, clearedBoard: newBoard };
//   }
//   const displayBoard = () => {
//     const tempBoard = board.map((row) => [...row]);
//     if (currentPiece) {
//       currentPiece.shape.forEach((row, dy) => {
//         row.forEach((value, dx) => {
//           if (value) {
//             const y = currentPiece.y + dy;
//             const x = currentPiece.x + dx;
//             if (y >= 0 && tempBoard[y] && tempBoard[y][x] !== undefined) {
//               tempBoard[y][x] = currentPiece.color;
//             }
//           }
//         });
//       });
//     }
//     return tempBoard;
//   };
//   const displayNextPiece = () => {
//     const empty = Array(4)
//       .fill()
//       .map(() => Array(4).fill(0));
//     const piece = nextPiece;
//     piece.shape.forEach((row, dy) => {
//       row.forEach((value, dx) => {
//         if (value) {
//           empty[dy][dx] = piece.color;
//         }
//       });
//     });
//     return empty;
//   };
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (isPaused || isGameOver) return;
//       switch (e.key) {
//         case "ArrowLeft":
//           moveLeft();
//           break;
//         case "ArrowRight":
//           moveRight();
//           break;
//         case "ArrowDown":
//           moveDown();
//           break;
//         case "ArrowUp":
//           rotate();
//           break;
//         case " ":
//           setIsPaused((prev) => !prev);
//           break;
//         default:
//           break;
//       }
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [moveDown, isPaused, isGameOver]);
//   function moveLeft() {
//     setCurrentPiece((prev) => {
//       const newX = prev.x - 1;
//       if (!collision(prev.shape, newX, prev.y)) {
//         return { ...prev, x: newX };
//       }
//       return prev;
//     });
//   }
//   function moveRight() {
//     setCurrentPiece((prev) => {
//       const newX = prev.x + 1;
//       if (!collision(prev.shape, newX, prev.y)) {
//         return { ...prev, x: newX };
//       }
//       return prev;
//     });
//   }
//   function rotate() {
//     setCurrentPiece((prev) => {
//       const rotated = prev.shape[0].map((_, i) =>
//         prev.shape.map((row) => row[i]).reverse()
//       );
//       if (!collision(rotated, prev.x, prev.y)) {
//         return { ...prev, shape: rotated };
//       }
//       return prev;
//     });
//   }
//   const resetGame = () => {
//     setBoard(createEmptyBoard());
//     setCurrentPiece(null);
//     setNextPiece(randomPiece());
//     setScore(0);
//     setLevel(1);
//     setClearedLines([]);
//     setIsPaused(false);
//     setIsGameOver(false);
//     setGameStarted(false);
//   };
//   return (
//     <div className="game">
//       <h1>Tetris</h1>
//       <div className="title">
//         <div className="try">
//           <div className="grid">
//             {displayBoard().map((row, y) => (
//               <div
//                 key={y}
//                 className={`row ${clearedLines.includes(y) ? "cleared" : ""}`}
//               >
//                 {row.map((cell, x) => (
//                   <div
//                     key={`${y}-${x}`}
//                     className="cell"
//                     style={{ backgroundColor: cell ? cell : "black" }}
//                   />
//                 ))}
//               </div>
//             ))}
//           </div>
//           <div className="grid1">
//             <button
//               className="action-button"
//               onClick={() => setShowHowToPlay(true)}
//             >
//               How to play <BsFillInfoCircleFill />
//             </button>
//             <div>
//               {gameStarted && (
//                 <div className="next-shape">
//                   <h2>Next Shape</h2>
//                   <div className="preview-grid">
//                     {displayNextPiece().map((row, y) => (
//                       <div key={y} className="preview-row">
//                         {row.map((cell, x) => (
//                           <div
//                             key={`${y}-${x}`}
//                             className="preview-cell"
//                             style={{ backgroundColor: cell ? cell : "#222" }}
//                           />
//                         ))}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//               <div style={{ display: "flex", justifyContent: "center" }}>
//                 <div className="score-container">
//                   <div className="score-label">Score</div>
//                   <div className="score-value">{score}</div>
//                 </div>
//               </div>
//             </div>
//             <div className="recent-scores">
//               <button
//                 className="action-button"
//                 onClick={() => setShowRecentScores(true)}
//               >
//                 Recent Scores
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//       {isGameOver && <h2>Game Over</h2>}
//       <div className="controls">
//         {currentPiece === null ? (
//           <button onClick={startGame}>
//             <FaRegCirclePlay className="control-icon play" />
//           </button>
//         ) : (
//           <>
//             <button onClick={() => (isPaused ? resumeGame() : pauseGame())}>
//               {isPaused ? (
//                 <GrResume className="control-icon resume" />
//               ) : (
//                 <FaRegPauseCircle className="control-icon pause" />
//               )}
//             </button>
//             <button onClick={resetGame}>
//               <GrPowerReset className="control-icon reset" />
//             </button>
//           </>
//         )}
//       </div>
//       {countdown > 0 && (
//         <div className="countdown-overlay">
//           <div className="countdown">{countdown}</div>
//         </div>
//       )}
//       {showHowToPlay && (
//         <div className="modal-overlay" onClick={() => setShowHowToPlay(false)}>
//           <div className="modal" onClick={(e) => e.stopPropagation()}>
//             <h2>How to Play</h2>
//             <ul>
//               <li>
//                 <FaLeftLong /> Move Left
//               </li>
//               <li>
//                 <FaArrowRightLong /> Move Right
//               </li>
//               <li>
//                 <FaLongArrowAltDown /> Move Down
//               </li>
//               <li>
//                 <FaLongArrowAltUp /> Rotate
//               </li>
//               <li>Space: Pause/Resume</li>
//               <li>Fill rows to clear them and score!</li>
//             </ul>
//             <button onClick={() => setShowHowToPlay(false)}>
//               <MdOutlineClose />
//             </button>
//           </div>
//         </div>
//       )}
//       {showRecentScores && (
//         <div
//           className="modal-overlay"
//           onClick={() => setShowRecentScores(false)}
//         >
//           <div className="modal" onClick={(e) => e.stopPropagation()}>
//             <h2>Recent Scores</h2>
//             <ul>
//               {recentScores.length === 0 ? (
//                 <li>No scores yet</li>
//               ) : (
//                 recentScores.map((s, i) => (
//                   <li key={i}>
//                     Score {i + 1}: {s}
//                   </li>
//                 ))
//               )}
//             </ul>
//             <button onClick={() => setShowRecentScores(false)}>
//               <MdOutlineClose />
//             </button>
//           </div>
//         </div>
//       )}
//       {showRecentScores && (
//         <div className="modal-overlay">
//           <div className="modal">
//             <button
//               className="modal-close"
//               onClick={() => setShowRecentScores(false)}
//             >
//               <MdOutlineClose />
//             </button>
//             <h2>Recent Scores</h2>
//             {recentScores.length === 0 ? (
//               <p>No scores yet.</p>
//             ) : (
//               <ol>
//                 {recentScores.map((s, i) => (
//                   <li key={i}>
//                     Score {i + 1}: {s}
//                   </li>
//                 ))}
//               </ol>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// export default Tetris;


// * {
//   box-sizing: border-box;
//   margin: 0;
//   padding: 0;
// }
// body {
//   background-color: #111;
//   color: white;
//   background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   min-height: 100%;
//   padding: 2rem;
// }
// .game {
//   text-align: center;
// }
// h1,
// h2 {
//   margin-bottom: 1rem;
//   color: #00e5ff;
//   text-shadow: 0 0 10px #00e5ff;
// }
// .grid {
//   display: grid;
//   grid-template-rows: repeat(10, 25px);
//   grid-template-columns: repeat(10, 25px);
//   gap: 3px;
//   justify-content: center;
//   margin: auto auto;
//   background-color: #222;
//   padding: 4px;
//   background-color: #111;
//   border: 4px solid;
//   animation: borderColorCycle 8s infinite;
// }
// .row {
//   display: contents;
// }
// .cell {
//   width: 25px;
//   height: 25px;
//   background-color: black;
//   border: none;
//   transition: background-color 0.2s ease;
// }
// .cleared .cell {
//   animation: blink 0.3s ease-in-out;
// }
// @keyframes blink {
//   0%,
//   100% {
//     opacity: 1;
//   }
//   50% {
//     opacity: 0.3;
//   }
// }
// .next-shape {
//   margin-top: 1rem;
// }
// .preview-grid {
//   display: grid;
//   grid-template-columns: repeat(4, 25px);
//   gap: 2px;
//   justify-content: center;
//   margin-top: 0.5rem;
// }
// .preview-row {
//   display: contents;
// }
// .preview-cell {
//   width: 25px;
//   height: 25px;
//   background-color: #222;
//   transition: background-color 0.2s ease;
// }
// .score {
//   margin-bottom: 10px;
//   color: #00ffcc;
//   text-shadow: 0 0 6px #00ffcc;
// }
// .score-container {
//   margin-top: 1rem;
// }
// .score-label {
//   font-size: 1.1rem;
//   color: #aaa;
// }
// .score-value {
//   font-size: 1.5rem;
//   font-weight: bold;
//   color: rgb(0, 255, 204);
// }
// .recent-scores {
//   margin-top: 1rem;
//   font-size: 0.9rem;
// }
// .recent-scores ul {
//   list-style: none;
//   padding-left: 0;
//   margin-top: 0.5rem;
// }
// .recent-scores li {
//   color: rgb(255, 255, 255);
//   text-shadow: rgb(0, 229, 255) 0px 0px 4px;
//   margin: 0.2rem 0;
// }
// .controls {
//   margin-top: 1rem;
//   display: flex;
//   justify-content: center;
//   gap: 1rem;
// }
// .controls button {
//   box-shadow: rgba(0, 229, 255, 0.5) 0px 0px 10px;
//   color: rgb(0, 0, 0);
//   cursor: pointer;
//   font-size: 1em;
//   background: linear-gradient(
//     135deg,
//     rgba(255, 0, 51, 0.4),
//     rgba(0, 179, 204, 0.4)
//   );
//   border-width: initial;
//   border-style: none;
//   border-color: initial;
//   border-image: initial;
//   border-radius: 8px;
//   padding: 7px;
//   transition: background 0.3s, transform 0.2s;
// }
// .action-button {
//   background-color: #333;
//   color: black;
//   font-weight: bold;
//   border: none;
//   padding: 10px 20px;
//   font-size: 1rem;
//   border-radius: 8px;
//   cursor: pointer;
//   transition: transform 0.2s, background 0.3s ease;
//   background: linear-gradient(135deg, #00ffff, #0077ff);
//   display: flex;
//   align-items: center;
//   gap: 8px;
//   box-shadow: 0 0 10px rgba(0, 255, 255, 0.6);
//   margin: 15px;
// }
// .action-button:hover {
//   background-color: #444;
// }
// .control-icon {
//   font-size: 1.5rem;
// }
// .modal-overlay {
//   position: fixed;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background-color: rgba(0, 0, 0, 0.7);
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   z-index: 100;
// }
// .modal {
//   background-color: #1a1a1a;
//   padding: 2rem;
//   border-radius: 10px;
//   max-width: 400px;
//   width: 90%;
//   position: relative;
//   box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
// }
// .modal h2 {
//   margin-bottom: 1rem;
// }
// .modal h2 {
//   margin-bottom: 15px;
//   color: #00ffff;
// }
// .modal ul {
//   list-style: none;
//   padding-left: 0;
//   text-align: left;
//   font-size: 1rem;
// }
// .modal ul li {
//   margin-bottom: 8px;
// }
// .modal button {
//   margin-top: 20px;
//   background: #00ffff;
//   color: #000;
//   border: none;
//   padding: 8px 16px;
//   font-weight: bold;
//   border-radius: 6px;
//   cursor: pointer;
//   transition: 0.2s ease;
// }
// .modal button:hover {
//   background: #00cccc;
// }
// .modal-close {
//   position: absolute;
//   top: 10px;
//   right: 10px;
//   background: none;
//   border: none;
//   color: white;
//   font-size: 1.2rem;
//   cursor: pointer;
// }
// .countdown-overlay {
//   position: absolute;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background-color: rgba(0, 0, 0, 0.8);
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   z-index: 99;
// }
// .countdown {
//   font-size: 4rem;
//   font-weight: bold;
//   color: white;
//   text-shadow: 0 0 10px #ff0000;
// }
// @media (max-width: 600px) {
//   .grid {
//     grid-template-columns: repeat(10, 20px);
//   }
//   .cell {
//     width: 20px;
//     height: 20px;
//   }
//   .preview-grid {
//     grid-template-columns: repeat(4, 20px);
//   }
//   .preview-cell {
//     width: 20px;
//     height: 20px;
//   }
//   .score-container {
//     font-size: 0.9rem;
//   }
// }
// .try {
//   display: flex;
//   justify-content: center;
//   gap: 40px;
// }
// .grid1 {
//   margin-left: 30px;
//   display: flex;
//   flex-direction: column;
//   gap: 20px;
//   justify-content: space-between;
//   border: 1px solid;
//   animation: borderColorCycle 8s infinite;
//   border-radius: 10px;
// }
// @keyframes flash {
//   0% {
//     background-color: white;
//   }
//   50% {
//     background-color: yellow;
//   }
//   100% {
//     background-color: black;
//   }
// }
// @keyframes borderColorCycle {
//   0% {
//     border-color: #ff5f6d;
//     box-shadow: 0 0 12px rgba(255, 95, 109, 0.5);
//   }
//   25% {
//     border-color: #00c6ff;
//     box-shadow: 0 0 12px rgba(0, 198, 255, 0.5);
//   }
//   50% {
//     border-color: #8e2de2;
//     box-shadow: 0 0 12px rgba(142, 45, 226, 0.5);
//   }
//   75% {
//     border-color: #43e97b;
//     box-shadow: 0 0 12px rgba(67, 233, 123, 0.5);
//   }
//   100% {
//     border-color: #ff5f6d;
//     box-shadow: 0 0 12px rgba(255, 95, 109, 0.5);
//   }
// }
// .control-icon {
//   font-size: 2.5rem;
//   transition: transform 0.2s, color 0.3s;
// }
// .control-icon:hover {
//   transform: scale(1.1);
//   filter: drop-shadow(0 0 6px white);
// }
// .control-icon.play {
//   color: rgb(0, 255, 30);
// }
// .control-icon.pause {
//   color: #fbff00;
// }
// .control-icon.resume {
//   color: #00ff08;
// }
// .control-icon.reset {
//   color: #ff0000;
// }
