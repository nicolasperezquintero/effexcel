import { configureStore } from "@reduxjs/toolkit";
import sheetReducer, {
  setCell,
  setInputText,
  setSelectedCell,
  clearSelection,
  moveCellDown,
  moveCellLeft,
  moveCellRight,
  moveCellUp,
  applyCell,
  addColumns,
  addRows,
  copySelectedToInput,
  setSelectingCell,
  addCellToFormula,
} from "./slices/sheetSlice";

const store = configureStore({
  reducer: {
    sheet: sheetReducer,
  },
});
export { store };
export {
  setCell,
  setInputText,
  setSelectedCell,
  clearSelection,
  moveCellDown,
  moveCellLeft,
  moveCellRight,
  moveCellUp,
  applyCell,
  addColumns,
  addRows,
  copySelectedToInput,
  setSelectingCell,
  addCellToFormula,
};
