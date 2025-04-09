import { useDispatch, useSelector } from "react-redux";
import { setSelectedCell } from "../store";
import { useEffect, useState } from "react";
import { useConvert } from "../hooks/useConvert";

const Cell = (props: { row: number; column: number }) => {
  const { row, column } = props;
  const [error, setError] = useState(false);
  const [result, setResult] = useState("");
  const [isFormula, setIsFormula] = useState(false);
  const regFormula = /(^\=([A-Z]+)\(([A-Z]+\d+)\,([A-Z]+\d+)\))$/;

  const { cellToNumber } = useConvert();

  const dispatch = useDispatch();
  const content = useSelector((state: any) => {
    return state.sheet.cells[row - 1][column - 1];
  });
  const cells = useSelector((state: any) => {
    return state.sheet.cells;
  });
  const selectedCell = useSelector((state: any) => {
    return state.sheet.selectedCell;
  });

  const isSelected = selectedCell?.row === row && selectedCell?.col === column;
  const inputText = useSelector((state: any) => {
    return state.sheet.inputText;
  });
  useEffect(() => {
    calculateFormula();
  }, [cells]);

  const calculateFormula = () => {
    if (!content) {
      return;
    }
    if (!content.startsWith("=")) {
      setIsFormula(false);
      setError(false);
      return;
    }
    setIsFormula(true);
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
                setResult("");
                return;
              }
              total += Number(cellValue);
            } else {
              isValid = false;
              setResult("");
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
            setResult("");
            return;
          }
          total = Number(cell1) - Number(cell2);

          break;
        default:
          isValid = false;
          break;
      }
      setResult(total.toString());
    } else {
      isValid = false;
    }
    setError(!isValid);

    return;
  };

  const handleClick = () => {
    dispatch(setSelectedCell({ row, col: column }));
  };

  return (
    <td
      onClick={handleClick}
      className={
        "border  text-black max-w-30 w-30 whitespace-nowrap overflow-hidden " +
        (isSelected
          ? "border-2 border-green-600 shadow-inner"
          : "border-slate-300") +
        (error ? " bg-red-200" : " bg-white")
      }
    >
      {isSelected
        ? inputText
        : isFormula
        ? error
          ? "#ERROR"
          : result
        : content}
    </td>
  );
};

export default Cell;
