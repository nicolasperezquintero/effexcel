import { createSlice } from "@reduxjs/toolkit";

interface Sheet {
  cells: string[][];
  selectedCell: {
    row: number;
    col: number;
  } | null;
  inputText: string;
  inputRef: React.RefObject<HTMLInputElement> | null;
}

const generateInitialCells = () => {
  const cells: string[][] = [];
  for (let i = 0; i < 50; i++) {
    const row: string[] = [];
    for (let j = 0; j < 26; j++) {
      row.push("");
    }
    cells.push(row);
  }
  return cells;
};

const initialState: Sheet = {
  cells: generateInitialCells(),
  selectedCell: null,
  inputText: "",
  inputRef: null,
};

const sheetSlice = createSlice({
  name: "sheet",
  initialState,
  reducers: {
    setCell(state, action) {
      const { row, col, value } = action.payload;
      state.cells[row - 1][col - 1] = value;
    },
    applyCell(state) {
      if (state.selectedCell == null) return;
      const { row, col } = state.selectedCell;
      const content = state.inputText;
      state.cells[row - 1][col - 1] = content;
    },
    setSelectedCell(state, action) {
      const { row, col } = action.payload;
      state.selectedCell = { row, col };
    },
    setInputText(state, action) {
      state.inputText = action.payload;
    },
    clearSelection(state) {
      state.selectedCell = null;
      state.inputText = "";
    },
    setInputRef(state, action) {
      state.inputRef = action.payload;
    },
    moveCellUp(state) {
      if (state.selectedCell) {
        const { row, col } = state.selectedCell;
        if (row > 1) {
          state.selectedCell = { row: row - 1, col };
        }
      }
    },
    moveCellDown(state) {
      if (state.selectedCell) {
        const { row, col } = state.selectedCell;
        if (row < state.cells.length) {
          state.selectedCell = { row: row + 1, col };
        }
      }
    },
    moveCellLeft(state) {
      if (state.selectedCell) {
        const { row, col } = state.selectedCell;
        if (col > 1) {
          state.selectedCell = { row, col: col - 1 };
        }
      }
    },
    moveCellRight(state) {
      if (state.selectedCell) {
        const { row, col } = state.selectedCell;
        if (col < state.cells[0].length) {
          state.selectedCell = { row, col: col + 1 };
        }
      }
    },
    addColumns(state) {
      let newCells: string[][] = state.cells;
      for (let i = 0; i < newCells.length; i++) {
        for (let j = 0; j < 5; j++) {
          newCells[i].push("");
        }
      }
      state.cells = newCells;
    },
    addRows(state) {
      const newCells = state.cells;
      for (let i = 0; i < 5; i++) {
        newCells.push(Array(state.cells[0].length).fill(""));
      }
      state.cells = newCells;
    },
    copySelectedToInput(state) {
      if (state.selectedCell) {
        const { row, col } = state.selectedCell;
        state.inputText = state.cells[row - 1][col - 1];
      }
    },
  },
});

export default sheetSlice.reducer;
export const {
  setCell,
  setSelectedCell,
  setInputText,
  clearSelection,
  setInputRef,
  moveCellUp,
  moveCellDown,
  moveCellLeft,
  moveCellRight,
  applyCell,
  addColumns,
  addRows,
  copySelectedToInput,
} = sheetSlice.actions;
