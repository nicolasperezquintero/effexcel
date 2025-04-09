import { useDispatch, useSelector } from "react-redux";
import { applyCell, clearSelection, setInputText } from "../store";
import { useEffect, useRef } from "react";
import "../styles/Header.css";

const Header = () => {
  const inputText = useSelector((state: any) => {
    return state.sheet.inputText;
  });
  const selectedCell = useSelector((state: any) => {
    return state.sheet.selectedCell;
  });
  const isSelectedCell = selectedCell != null;
  const cells = useSelector((state: any) => {
    return state.sheet.cells;
  });

  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (selectedCell != null && inputRef.current != null) {
      inputRef.current.focus();
      dispatch(setInputText(cells[selectedCell.row - 1][selectedCell.col - 1]));
    }
  }, [selectedCell]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setInputText(event.target.value));
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && selectedCell != null) {
      dispatch(applyCell());
      dispatch(clearSelection());
      return;
    }
  };
  return (
    <div
      className="w-screen h-40 flex-col items-start w-screen"
      onClick={() => {
        dispatch(clearSelection());
      }}
    >
      <div className="w-screen h-25 text-white bg-green-700 p-1 flex p-4 flex-row filter drop-shadow items-center z-30 relative">
        <h3 className="font-black text-4xl">Effexcel</h3>
      </div>
      <div className="w-screen h-15 bg-green-900 flex row pl-4 z-10 items-start">
        <div
          className={
            " bg-green-700 flex items-center justify-center p-3 flex-row h-10 rounded-b-lg z-20 transition-transform " +
            (isSelectedCell ? "translate-y-0" : "-translate-y-full")
          }
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <h5 className="font-semibold mr-3">Editar Celda: </h5>
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="rounded bg-white text-black pl-1"
            ref={inputRef}
            disabled={!isSelectedCell}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
