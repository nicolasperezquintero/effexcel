import { useDispatch, useSelector } from "react-redux";
import {
  addCellToFormula,
  applyCell,
  clearSelection,
  setInputText,
  setSelectedCell,
  setSelectingCell,
} from "../store";
import { SyntheticEvent, useEffect, useMemo } from "react";
import { useConvert } from "../hooks/useConvert";

const Cell = (props: { row: number; column: number; content: string }) => {
  const { row, column, content } = props;
  const regFormula = /(^\=([A-Z]+)\((([A-Z]+\d+)|\d+)\,(([A-Z]+\d+)|\d+)\))$/;

  const { cellToNumber } = useConvert();

  const dispatch = useDispatch();

  const cells = useSelector((state: any) => {
    return state.sheet.cells;
  });
  const selected = useSelector((state: any) => {
    return (
      state.sheet.selectedCell?.row === row &&
      state.sheet.selectedCell?.col === column
    );
  });
  const selectingCell = useSelector((state: any) => {
    return state.sheet.selectingCell;
  });

  const inputText = useSelector((state: any) => {
    return selected ? state.sheet.inputText : null;
  });
  useEffect(() => {
    if (selected) {
      if (
        selected &&
        (/^=[A-Za-z]+\($/.test(inputText.replaceAll(" ", "")) ||
          /^=[A-Za-z]+\((([A-Za-z]+\d+)|\d+)\,$/.test(
            inputText.replaceAll(" ", "")
          ))
      ) {
        dispatch(setSelectingCell(true));
      } else {
        dispatch(setSelectingCell(false));
      }
    }
  }, [inputText, selected]);

  const calculateFormula = (): {
    error: boolean;
    isFormula: boolean;
    result: string;
  } => {
    if (!content) {
      return { error: false, isFormula: false, result: "" };
    }
    if (!content.startsWith("=")) {
      return { error: false, isFormula: false, result: "" };
    }
    let isValid = true;
    const formula = content.replace(/\s/g, "").toUpperCase();
    if (regFormula.test(formula)) {
      const funcion = formula.slice(1, formula.indexOf("("));
      const params = formula
        .slice(formula.indexOf("(") + 1, formula.indexOf(")"))
        .split(",");
      let total = 0;
      switch (funcion) {
        case "SUMA":
          params.forEach((param: string) => {
            if (/^\d+$/.test(param)) {
              //es numero
              total += Number(param);
            } else {
              const cell = cellToNumber(param);
              if (cell) {
                const cellValue = cells[cell.row - 1][cell.col - 1];
                if (isNaN(Number(cellValue || "0"))) {
                  isValid = false;
                  return;
                }
                total += Number(cellValue);
              } else {
                isValid = false;
                return;
              }
            }
          });
          break;
        case "RESTA":
          const cellsNumbers = params.map((param: string) => {
            if (/^\d+$/.test(param)) {
              //es numero
              return Number(param);
            } else {
              return cellToNumber(param);
            }
          });

          const cell1 =
            typeof cellsNumbers[0] === "number"
              ? cellsNumbers[0]
              : cells[cellsNumbers[0].row - 1][cellsNumbers[0].col - 1];
          const cell2 =
            typeof cellsNumbers[1] === "number"
              ? cellsNumbers[1]
              : cells[cellsNumbers[1].row - 1][cellsNumbers[1].col - 1];
          if (isNaN(Number(cell1 || "0")) || isNaN(Number(cell2 || "0"))) {
            isValid = false;
          }
          total = Number(cell1) - Number(cell2);

          break;
        default:
          isValid = false;
          break;
      }
      return { error: !isValid, isFormula: true, result: total.toString() };
    } else {
      return { error: true, isFormula: true, result: "" };
    }

    //return;
  };
  const { error, isFormula, result } = useMemo(() => {
    return calculateFormula();
    //HACE QUE CALCULATE DEVUELVA EL OBJETO
  }, [content, cells]);

  const handleClick = (e: SyntheticEvent) => {
    if (selectingCell) {
      e.preventDefault();
      dispatch(addCellToFormula({ row, col: column }));
    } else if (!selected) {
      dispatch(applyCell());
      dispatch(setSelectedCell({ row, col: column }));
    }
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTableCellElement>) => {
    if (event.key === "Enter") {
      dispatch(applyCell());
      dispatch(clearSelection());
      return;
    }
    if (event.key === "Escape") {
      dispatch(clearSelection());
      return;
    }
  };

  return (
    <td
      onMouseDown={handleClick}
      onKeyDown={handleKeyDown}
      className={
        "border  text-black max-w-30 w-30 whitespace-nowrap overflow-hidden " +
        (selected
          ? "border-2 border-green-600 shadow-inner"
          : "border-slate-300") +
        (error ? " bg-red-200" : " bg-white")
      }
    >
      {selected ? (
        <input
          type="text"
          className="rounded"
          value={inputText}
          onChange={(e) => {
            dispatch(setInputText(e.target.value));
          }}
        />
      ) : isFormula ? (
        error ? (
          "#ERROR"
        ) : (
          result
        )
      ) : (
        content
      )}
    </td>
  );
};

export default Cell;
