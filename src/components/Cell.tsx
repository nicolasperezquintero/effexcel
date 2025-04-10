import { useDispatch, useSelector } from "react-redux";
import { setSelectedCell } from "../store";
import { useMemo } from "react";
import { useConvert } from "../hooks/useConvert";

const Cell = (props: { row: number; column: number; content: string }) => {
  const { row, column, content } = props;
  const regFormula = /(^\=([A-Z]+)\(([A-Z]+\d+)\,([A-Z]+\d+)\))$/;

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

  const inputText = useSelector((state: any) => {
    return selected ? state.sheet.inputText : null;
  });

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
    const formula = content.replace(" ", "");
    if (regFormula.test(formula)) {
      const funcion = formula.slice(1, formula.indexOf("("));
      const params = formula
        .slice(formula.indexOf("(") + 1, formula.indexOf(")"))
        .split(",");
      let total = 0;
      switch (funcion) {
        case "SUMA":
          params.forEach((param: string) => {
            const cell = cellToNumber(param);
            if (cell) {
              const cellValue = cells[cell.row - 1][cell.col - 1];
              if (isNaN(Number(cellValue)) || cellValue === "") {
                isValid = false;
                return;
              }
              total += Number(cellValue);
            } else {
              isValid = false;
              return;
            }
          });
          break;
        case "RESTA":
          const cellsNumbers = params.map((param: string) => {
            return cellToNumber(param);
          });
          const cell1 = cells[cellsNumbers[0].row - 1][cellsNumbers[0].col - 1];
          const cell2 = cells[cellsNumbers[1].row - 1][cellsNumbers[1].col - 1];
          if (
            isNaN(Number(cell1)) ||
            cell1 === "" ||
            isNaN(Number(cell2)) ||
            cell2 === ""
          ) {
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

  const handleClick = () => {
    dispatch(setSelectedCell({ row, col: column }));
  };

  return (
    <td
      onClick={handleClick}
      className={
        "border  text-black max-w-30 w-30 whitespace-nowrap overflow-hidden " +
        (selected
          ? "border-2 border-green-600 shadow-inner"
          : "border-slate-300") +
        (error ? " bg-red-200" : " bg-white")
      }
    >
      {selected ? inputText : isFormula ? (error ? "#ERROR" : result) : content}
    </td>
  );
};

export default Cell;
