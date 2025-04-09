import { useSelector } from "react-redux";
import { useConvert } from "../hooks/useConvert";
import Cell from "./Cell";

const Table = () => {
  const { numberToLetter } = useConvert();
  const cells = useSelector((state: any) => {
    return state.sheet.cells;
  });
  return (
    <div className="w-screen overflow-auto">
      <table>
        <thead>
          <tr>
            <th className="border border-slate-300 sticky">-</th>
            {cells[0].map((_: any, index: number) => (
              <th
                key={index}
                className="border border-gray-400 text-gray-700 sticky bg-gray-300"
              >
                {numberToLetter(index + 1)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cells.map((_: any, rowIndex: number) => (
            <tr key={rowIndex}>
              <th className="border border-gray-400 text-gray-700 bg-gray-300 sticky w-20 text-center">
                {rowIndex + 1}
              </th>
              {cells.map((_: any, colIndex: number) => (
                <Cell
                  key={colIndex.toString() + rowIndex.toString()}
                  row={rowIndex + 1}
                  column={colIndex + 1}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
