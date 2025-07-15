// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { ROWS, COLUMNS, TETROMINOS, COLORS } from "./Constant";
// function dummy() {
//   const [board, setBoard] = useState(createEmptyBoard());
//   const [currentPiece, setCurrentPiece] = useState(null);
//   const [nextPiece, setNextPiece] = useState(randomPiece());
//   const [score, setScore] = useState(0);
//   const [level, setLevel] = useState(1);
//   const [clearedLines, setClearedLines] = useState([]);
//   const [recentScores, setRecentScores] = useState([]);
//   const [isPaused, setIsPaused] = useState(false);
//   const [isGameOver, setIsGameOver] = useState(false);
//   const intervalRef = useRef(null);
//   // const moveDown = useCallback(() => {
//   //   setCurrentPiece((prev) => {
//   //     if (!prev) return prev;
//   //     const newY = prev.y + 1;
//   //     if (!collision(prev.shape, prev.x, newY)) {
//   //       return { ...prev, y: newY };
//   //     } else {
//   //       const newBoard = mergePiece(board, prev);
//   //       let linesCleared = clearLines(newBoard);
//   //       setScore((s) => s + linesCleared * 10);
//   //       setLevel((l) => l + Math.floor(linesCleared / 10));
//   //       if (prev.y === 0) {
//   //         setIsGameOver(true);
//   //         clearInterval(intervalRef.current);
//   //         setRecentScores((prevScores) => [score, ...prevScores].slice(0, 5));
//   //         return null;
//   //       } else {
//   //         setBoard(newBoard);
//   //         const newPiece = nextPiece;
//   //         setNextPiece(randomPiece());
//   //         return newPiece;
//   //       }
//   //     }
//   //   });
//   // }, [board, nextPiece]);
//   const moveDown = useCallback(() => {
//     if (!currentPiece) return;
//     const newY = currentPiece.y + 1;
//     if (!collision(currentPiece.shape, currentPiece.x, newY)) {
//       setCurrentPiece((prev) => ({ ...prev, y: newY }));
//     } else {
//       const mergedBoard = mergePiece(board, currentPiece);
//       const linesCleared = clearLines(mergedBoard); // clears and updates board
//       setScore((s) => s + linesCleared * 10);
//       setLevel((l) => l + Math.floor(linesCleared / 10));
//       // Game Over if piece is placed at top row
//       if (currentPiece.y === 0) {
//         setIsGameOver(true);
//         setRecentScores((prev) => [score, ...prev].slice(0, 5));
//         return;
//       }
//       // Place next piece
//       setBoard(mergedBoard);
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
//     startGame();
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
//   const startGame = () => {
//     setBoard(createEmptyBoard());
//     const newPiece = nextPiece;
//     const upcoming = randomPiece();
//     setCurrentPiece(newPiece);
//     setNextPiece(upcoming);
//     setScore(0);
//     setLevel(1);
//     setClearedLines([]);
//     setRecentScores([]);
//     setIsPaused(false);
//     setIsGameOver(false);
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
//   // function clearLines(board) {
//   //   let linesCleared = 0;
//   //   const newBoard = [...board];
//   //   for (let y = ROWS - 1; y >= 0; y--) {
//   //     if (newBoard[y].every((cell) => cell !== 0)) {
//   //       linesCleared++;
//   //       setClearedLines((prev) => [...prev, y]);
//   //       setTimeout(() => {
//   //         setClearedLines((prev) => prev.filter((line) => line !== y));
//   //       }, 300);
//   //       newBoard.splice(y, 1);
//   //       newBoard.unshift(Array(COLUMNS).fill(0));
//   //       y++; // check the same row again after shifting
//   //     }
//   //   }
//   //   setBoard(newBoard);
//   //   return linesCleared;
//   // }
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
//         y++; // recheck same row
//       }
//     }
//     // Important: return the updated board
//     setBoard(newBoard); // ✅ apply it immediately
//     return linesCleared;
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
//   return (
//     <div className="game">
//       <h1>Tetris</h1>
//       <div className="title">
//         <div className="grid">
//           {displayBoard().map((row, y) => (
//             <div
//               key={y}
//               className={`row ${clearedLines.includes(y) ? "cleared" : ""}`}
//             >
//               {row.map((cell, x) => (
//                 <div
//                   key={`${y}-${x}`}
//                   className="cell"
//                   style={{ backgroundColor: cell ? cell : "black" }}
//                 />
//               ))}
//             </div>
//           ))}
//         </div>
//         <div className="next-shape">
//           <h2>Next Shape</h2>
//           <div className="preview-grid">
//             {displayNextPiece().map((row, y) => (
//               <div key={y} className="preview-row">
//                 {row.map((cell, x) => (
//                   <div
//                     key={`${y}-${x}`}
//                     className="preview-cell"
//                     style={{ backgroundColor: cell ? cell : "#222" }}
//                   />
//                 ))}
//               </div>
//             ))}
//           </div>
//         </div>
//         <div>
//           <div className="score">Score: {score}</div>
//           <div className="score">Level: {level}</div>
//         </div>
//       </div>
//       <div className="controls">
//         <button onClick={() => setIsPaused((p) => !p)}>
//           {isPaused ? "Resume" : "Pause"}
//         </button>
//         <button onClick={startGame}>Reset Game</button>
//       </div>
//       <p>Use Arrow keys. ↑ = rotate, Space = pause/resume.</p>
//       <div className="recent-scores">
//         <h3>Recent Scores</h3>
//         <ul>
//           {recentScores.length === 0 && <li>No scores yet</li>}
//           {recentScores.map((s, i) => (
//             <li key={i}>
//               Score {i + 1}: {s}
//             </li>
//           ))}
//         </ul>
//         {isGameOver && <h2>Game Over</h2>}
//       </div>
//     </div>
//   );
// }
// export default dummy;
