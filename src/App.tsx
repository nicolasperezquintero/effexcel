import { useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import Table from "./components/Table";
import { useDispatch } from "react-redux";
import {
  applyCell,
  clearSelection,
  moveCellDown,
  moveCellLeft,
  moveCellRight,
  moveCellUp,
} from "./store";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        dispatch(clearSelection());
        return;
      }
      if (event.key === "ArrowDown") {
        dispatch(applyCell());
        dispatch(moveCellDown());
        return;
      }
      if (event.key === "ArrowLeft") {
        dispatch(applyCell());
        dispatch(moveCellLeft());
        return;
      }
      if (event.key === "ArrowRight") {
        dispatch(applyCell());
        dispatch(moveCellRight());
        return;
      }
      if (event.key === "ArrowUp") {
        dispatch(applyCell());
        dispatch(moveCellUp());
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return (
    <div className="w-screen h-screen flex-col items-center bg-white">
      <Header />
      <Table />
    </div>
  );
}

export default App;
