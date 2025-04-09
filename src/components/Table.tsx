import { useDispatch, useSelector } from "react-redux";
import { useConvert } from "../hooks/useConvert";
import Cell from "./Cell";
import { BaseSyntheticEvent } from "react";
import { addColumns, addRows } from "../store";

const Table = () => {
  const { numberToLetter } = useConvert();
  const dispatch = useDispatch();
  const cells = useSelector((state: any) => {
    return state.sheet.cells;
  });
  const handleScroll = (event: BaseSyntheticEvent) => {
    if (!event.target) return;
    const bottom =
      event.target.scrollHeight >=
      event.target.scrollTop + event.target.clientHeight - 200;
    const end =
      event.target.scrollWidth >=
      event.target.scrollLeft + event.target.clientWidth - 200;
    if (bottom) {
      dispatch(addRows());
    }
    if (end) {
      dispatch(addColumns());
    }
  };
  return (
    <div
      className="max-w-screen flex-grow-1 overflow-auto"
      onScroll={(e) => handleScroll(e)}
    >
      <table
        className="w-max h-max border-separate table-fixed"
        style={{ borderSpacing: 0 }}
      >
        <thead>
          <tr className="z-40">
            <th className="border border-slate-300 sticky top-0">-</th>
            {cells[0].map((_: any, index: number) => (
              <th
                key={index}
                className="border border-gray-400 text-gray-700 sticky top-0 bg-gray-300"
              >
                {numberToLetter(index + 1)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cells.map((row: any, rowIndex: number) => (
            <tr key={rowIndex}>
              <th className="border border-gray-400 text-gray-700 bg-gray-300 sticky left-0 w-20 text-center">
                {rowIndex + 1}
              </th>
              {row.map((_: any, colIndex: number) => {
                return (
                  <Cell
                    key={numberToLetter(colIndex) + rowIndex.toString()}
                    row={rowIndex + 1}
                    column={colIndex + 1}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
