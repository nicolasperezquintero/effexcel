import { useDispatch, useSelector } from "react-redux";
import {
  addCellToFormula,
  applyCell,
  clearSelection,
  freeArrows,
  setInputText,
  setSelectedCell,
  setSelectingCell,
} from "../store";
import { SyntheticEvent, useEffect, useMemo } from "react";
import { useConvert } from "../hooks/useConvert";

const Cell = (props: { row: number; column: number; content: string }) => {
  const { row, column, content } = props;
  const regFormula =
    /(^\=([A-Z]+)\((([A-Z]+\d+)|\-{0,1}\d+(\.\d+){0,1})\,(([A-Z]+\d+)|\-{0,1}\d+(\.\d+){0,1})\))$/;

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
          /^=[A-Za-z]+\((([A-Za-z]+\d+)|\-{0,1}\d+(\.\d+){0,1})\,$/.test(
            inputText.replaceAll(" ", "")
          ))
      ) {
        dispatch(setSelectingCell(true));
      } else {
        dispatch(setSelectingCell(false));
      }
    }
  }, [inputText, selected]);

  const calculateFormula = (
    realContent: string = content,
    caller: { callerRow: number; callerColumn: number } | null = null
  ): {
    error: boolean;
    isFormula: boolean;
    result: string;
  } => {
    if (!realContent) {
      return { error: false, isFormula: false, result: "" };
    }
    if (!realContent.startsWith("=")) {
      return { error: false, isFormula: false, result: "" };
    }
    let isValid = true;
    const formula = realContent.replace(/\s/g, "").toUpperCase();
    if (regFormula.test(formula)) {
      const funcion = formula.slice(1, formula.indexOf("("));
      const params = formula
        .slice(formula.indexOf("(") + 1, formula.indexOf(")"))
        .split(",");
      let total = 0;
      switch (funcion) {
        case "SUMA":
          params.forEach((param: string) => {
            if (/^\-{0,1}\d+(\.\d+){0,1}$/.test(param)) {
              //es numero
              total += Number(param);
            } else {
              const cell = cellToNumber(param);
              if (cell) {
                if (
                  (cell.col == column && cell.row == row) ||
                  (caller &&
                    caller.callerRow == cell.row &&
                    caller.callerColumn == cell.col)
                ) {
                  //evitar stackoverflow
                  isValid = false;
                  return;
                }
                let cellValue = cells[cell.row - 1][cell.col - 1];
                let cellFormula = calculateFormula(cellValue, {
                  callerRow: cell.row,
                  callerColumn: cell.col,
                });
                if (cellFormula.isFormula) {
                  if (cellFormula.error) {
                    isValid = false;
                    return;
                  }
                  cellValue = cellFormula.result;
                }
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
            if (/^\-{0,1}\d+(\.\d+){0,1}$/.test(param)) {
              //PERMITIR NEGATIVOS
              //es numero
              return parseFloat(param);
            } else {
              return cellToNumber(param);
            }
          });
          if (
            (typeof cellsNumbers[0] !== "number" &&
              ((cellsNumbers[0].row == row && cellsNumbers[0].col == column) ||
                (caller &&
                  cellsNumbers[0].row == caller.callerRow &&
                  cellsNumbers[0].col == caller.callerColumn))) ||
            (typeof cellsNumbers[1] !== "number" &&
              ((cellsNumbers[1].row == row && cellsNumbers[1].col == column) ||
                (caller &&
                  cellsNumbers[1].row == caller.callerRow &&
                  cellsNumbers[1].col == caller.callerColumn)))
          ) {
            isValid = false;
            return { error: true, isFormula: true, result: "" };
          }
          let cell1, cell2;
          if (typeof cellsNumbers[0] === "number") {
            cell1 = cellsNumbers[0];
          } else {
            cell1 = cells[cellsNumbers[0].row - 1][cellsNumbers[0].col - 1];
            let cellFormula = calculateFormula(cell1, {
              callerRow: cellsNumbers[0].row,
              callerColumn: cellsNumbers[0].col,
            });
            if (cellFormula.isFormula) {
              if (cellFormula.error) {
                isValid = false;
              }
              cell1 = cellFormula.result;
            }
          }
          if (typeof cellsNumbers[1] === "number") {
            cell2 = cellsNumbers[1];
          } else {
            cell2 = cells[cellsNumbers[1].row - 1][cellsNumbers[1].col - 1];
            let cellFormula = calculateFormula(cell2, {
              callerRow: cellsNumbers[1].row,
              callerColumn: cellsNumbers[1].col,
            });
            if (cellFormula.isFormula) {
              if (cellFormula.error) {
                isValid = false;
              }
              cell2 = cellFormula.result;
            }
          }
          /*
          let cell2 =
            typeof cellsNumbers[1] === "number"
              ? cellsNumbers[1]
              : cells[cellsNumbers[1].row - 1][cellsNumbers[1].col - 1];
          cellFormula = calculateFormula(
            cell2,
            typeof cellsNumbers[1] === "number"
              ? null
              : {
                  callerRow: cellsNumbers[1].row,
                  callerColumn: cellsNumbers[1].col,
                }
          );
          if (cellFormula.isFormula) {
            if (cellFormula.error) {
              isValid = false;
            }
            cell2 = cellFormula.result;
          }
            */
          if (
            isNaN(parseFloat(cell1 || "0")) ||
            isNaN(parseFloat(cell2 || "0"))
          ) {
            isValid = false;
          }
          total = parseFloat(cell1) - parseFloat(cell2);

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
    dispatch(freeArrows());
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
          autoFocus
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
