/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback, useRef } from "react";
import { ROWS, COLUMNS, TETROMINOS, COLORS } from "./Constant";
import { FaRegCirclePlay, FaArrowRightLong, FaLeftLong } from "react-icons/fa6";
import {
  FaRegPauseCircle,
  FaLongArrowAltUp,
  FaLongArrowAltDown,
} from "react-icons/fa";
import { GrPowerReset, GrResume } from "react-icons/gr";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { MdOutlineClose } from "react-icons/md";
function Tetris() {
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState(null);
  const [nextPiece, setNextPiece] = useState(randomPiece());
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [clearedLines, setClearedLines] = useState([]);
  const [recentScores, setRecentScores] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showRecentScores, setShowRecentScores] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const intervalRef = useRef(null);
  const moveDown = useCallback(() => {
    if (!currentPiece) return;
    const newY = currentPiece.y + 1;
    if (!collision(currentPiece.shape, currentPiece.x, newY)) {
      setCurrentPiece((prev) => ({ ...prev, y: newY }));
    } else {
      const mergedBoard = mergePiece(board, currentPiece);
      const { linesCleared, clearedBoard } = clearLines(mergedBoard);
      setBoard(clearedBoard);
      setScore((s) => s + linesCleared * 10);
      setLevel((l) => l + Math.floor(linesCleared / 10));
      if (currentPiece.y === 0) {
        setIsGameOver(true);
        setRecentScores((prev) => [score, ...prev].slice(0, 5));
        return;
      }
      setCurrentPiece(nextPiece);
      setNextPiece(randomPiece());
    }
  }, [board, currentPiece, nextPiece]);
  useEffect(() => {
    const savedScores = JSON.parse(
      localStorage.getItem("recentScores") || "[]"
    );
    setRecentScores(savedScores);
  }, []);
  useEffect(() => {
    localStorage.setItem("recentScores", JSON.stringify(recentScores));
  }, [recentScores]);
  useEffect(() => {
    if (!isPaused && !isGameOver) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(
        moveDown,
        Math.max(1000 - level * 100, 100)
      );
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [moveDown, isPaused, level, isGameOver]);
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);
  function createEmptyBoard() {
    return Array.from({ length: ROWS }, () => Array(COLUMNS).fill(0));
  }
  function randomPiece() {
    const keys = Object.keys(TETROMINOS);
    const key = keys[Math.floor(Math.random() * keys.length)];
    const shape = TETROMINOS[key];
    return {
      shape,
      x: Math.floor((COLUMNS - shape[0].length) / 2),
      y: 0,
      color: COLORS[key],
    };
  }
  const startCountdown = (callback, duration = 3) => {
    setCountdown(duration);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          setTimeout(() => {
            setCountdown(0);
            if (callback) callback();
          }, 300);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  const startGame = () => {
    startCountdown(() => {
      setBoard(createEmptyBoard());
      const newPiece = randomPiece();
      const upcoming = randomPiece();
      setCurrentPiece(newPiece);
      setNextPiece(upcoming);
      setScore(0);
      setLevel(1);
      setClearedLines([]);
      setIsPaused(false);
      setIsGameOver(false);
      setGameStarted(true);
    });
  };
  const resumeGame = () => {
    startCountdown(() => {
      setIsPaused(false);
    });
  };
  const pauseGame = () => {
    setIsPaused(true);
    clearInterval(intervalRef.current);
  };
  function collision(shape, x, y) {
    for (let dy = 0; dy < shape.length; dy++) {
      for (let dx = 0; dx < shape[dy].length; dx++) {
        if (shape[dy][dx]) {
          let boardY = y + dy;
          let boardX = x + dx;
          if (
            boardX < 0 ||
            boardX >= COLUMNS ||
            boardY >= ROWS ||
            (boardY >= 0 && board[boardY]?.[boardX])
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }
  function mergePiece(board, piece) {
    const newBoard = board.map((row) => [...row]);
    piece.shape.forEach((row, dy) => {
      row.forEach((value, dx) => {
        if (
          value &&
          newBoard[piece.y + dy] &&
          newBoard[piece.y + dy][piece.x + dx] !== undefined
        ) {
          newBoard[piece.y + dy][piece.x + dx] = piece.color;
        }
      });
    });
    return newBoard;
  }
  function clearLines(tempBoard) {
    let linesCleared = 0;
    const newBoard = [...tempBoard];
    for (let y = ROWS - 1; y >= 0; y--) {
      if (newBoard[y].every((cell) => cell !== 0)) {
        linesCleared++;
        setClearedLines((prev) => [...prev, y]);
        setTimeout(() => {
          setClearedLines((prev) => prev.filter((line) => line !== y));
        }, 300);
        newBoard.splice(y, 1);
        newBoard.unshift(Array(COLUMNS).fill(0));
        y++;
      }
    }
    return { linesCleared, clearedBoard: newBoard };
  }
  const displayBoard = () => {
    const tempBoard = board.map((row) => [...row]);
    if (currentPiece) {
      currentPiece.shape.forEach((row, dy) => {
        row.forEach((value, dx) => {
          if (value) {
            const y = currentPiece.y + dy;
            const x = currentPiece.x + dx;
            if (y >= 0 && tempBoard[y] && tempBoard[y][x] !== undefined) {
              tempBoard[y][x] = currentPiece.color;
            }
          }
        });
      });
    }
    return tempBoard;
  };
  const displayNextPiece = () => {
    const empty = Array(4)
      .fill()
      .map(() => Array(4).fill(0));
    const piece = nextPiece;
    piece.shape.forEach((row, dy) => {
      row.forEach((value, dx) => {
        if (value) {
          empty[dy][dx] = piece.color;
        }
      });
    });
    return empty;
  };
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isPaused || isGameOver) return;
      switch (e.key) {
        case "ArrowLeft":
          moveLeft();
          break;
        case "ArrowRight":
          moveRight();
          break;
        case "ArrowDown":
          moveDown();
          break;
        case "ArrowUp":
          rotate();
          break;
        case " ":
          setIsPaused((prev) => !prev);
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [moveDown, isPaused, isGameOver]);
  function moveLeft() {
    setCurrentPiece((prev) => {
      const newX = prev.x - 1;
      if (!collision(prev.shape, newX, prev.y)) {
        return { ...prev, x: newX };
      }
      return prev;
    });
  }
  function moveRight() {
    setCurrentPiece((prev) => {
      const newX = prev.x + 1;
      if (!collision(prev.shape, newX, prev.y)) {
        return { ...prev, x: newX };
      }
      return prev;
    });
  }
  function rotate() {
    setCurrentPiece((prev) => {
      const rotated = prev.shape[0].map((_, i) =>
        prev.shape.map((row) => row[i]).reverse()
      );
      if (!collision(rotated, prev.x, prev.y)) {
        return { ...prev, shape: rotated };
      }
      return prev;
    });
  }
  const resetGame = () => {
    setBoard(createEmptyBoard());
    setCurrentPiece(null);
    setNextPiece(randomPiece());
    setLevel(1);
    setClearedLines([]);
    setIsPaused(false);
    setIsGameOver(false);
    setGameStarted(false);
  };
  return (
    <div className="game">
      <h1>Tetris</h1>
      <div className="title">
        <div className="try">
          <div className="grid">
            {displayBoard().map((row, y) => (
              <div
                key={y}
                className={`row ${clearedLines.includes(y) ? "cleared" : ""}`}
              >
                {row.map((cell, x) => (
                  <div
                    key={`${y}-${x}`}
                    className="cell"
                    style={{ backgroundColor: cell ? cell : "black" }}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="grid1">
            <button
              className="action-button"
              onClick={() => setShowHowToPlay(true)}
            >
              How to play <BsFillInfoCircleFill />
            </button>
            <div>
              {gameStarted && (
                <div className="next-shape">
                  <h2>Next Shape</h2>
                  <div className="preview-grid">
                    {displayNextPiece().map((row, y) => (
                      <div key={y} className="preview-row">
                        {row.map((cell, x) => (
                          <div
                            key={`${y}-${x}`}
                            className="preview-cell"
                            style={{ backgroundColor: cell ? cell : "#222" }}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div className="score-container">
                  <div className="score-label">Score</div>
                  <div className="score-value">{score}</div>
                </div>
              </div>
            </div>
            <div className="recent-scores">
              <button
                className="action-button"
                onClick={() => setShowRecentScores(true)}
              >
                Recent Scores
              </button>
            </div>
          </div>
        </div>
      </div>
      {isGameOver && (
        <div className="modal-overlay" onClick={() => setIsGameOver(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setIsGameOver(false)}
            >
              <MdOutlineClose />
            </button>
            \<h2>Game Over</h2>
            <p>Your Score: {score}</p>
            <button onClick={resetGame}>Play Again</button>
          </div>
        </div>
      )}
      <div className="controls">
        {currentPiece === null ? (
          <button onClick={startGame}>
            <FaRegCirclePlay className="control-icon play" />
          </button>
        ) : (
          <>
            <button onClick={() => (isPaused ? resumeGame() : pauseGame())}>
              {isPaused ? (
                <GrResume className="control-icon resume" />
              ) : (
                <FaRegPauseCircle className="control-icon pause" />
              )}
            </button>
            <button onClick={resetGame}>
              <GrPowerReset className="control-icon reset" />
            </button>
          </>
        )}
      </div>
      {countdown > 0 && (
        <div className="countdown-overlay">
          <div className="countdown">{countdown}</div>
        </div>
      )}
      {showHowToPlay && (
        <div className="modal-overlay" onClick={() => setShowHowToPlay(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>How to Play</h2>
            <ul>
              <li>
                <FaLeftLong /> Move Left
              </li>
              <li>
                <FaArrowRightLong /> Move Right
              </li>
              <li>
                <FaLongArrowAltDown /> Move Down
              </li>
              <li>
                <FaLongArrowAltUp /> Rotate
              </li>
              <li>Space: Pause/Resume</li>
              <li>Fill rows to clear them and score!</li>
            </ul>
            <button
              className="modal-close"
              onClick={() => setShowHowToPlay(false)}
            >
              <MdOutlineClose />
            </button>
          </div>
        </div>
      )}
      {showRecentScores && (
        <div className="modal-overlay">
          <div className="modal">
            <button
              className="modal-close"
              onClick={() => setShowRecentScores(false)}
            >
              <MdOutlineClose />
            </button>
            <h2>Recent Scores</h2>
            {recentScores.length === 0 ? (
              <p>No scores yet.</p>
            ) : (
              <ol>
                {recentScores.map((s, i) => (
                  <li key={i}>
                    Score {i + 1}: {s}
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default Tetris;
