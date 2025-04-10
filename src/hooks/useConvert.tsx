export const useConvert = () => {
  const numberToLetter = (num: number) => {
    //pasa a base 26
    let letter = "";
    let temp = num;
    while (temp > 0) {
      const mod = (temp - 1) % 26;
      letter = String.fromCharCode(65 + mod) + letter;
      temp = Math.floor((temp - mod) / 26);
    }
    return letter;
  };
  const letterToNumber = (letter: string) => {
    //pasa de base 26 a decimal
    let num = 0;
    for (let i = 0; i < letter.length; i++) {
      num = num * 26 + letter.charCodeAt(i) - 64;
    }
    return num;
  };

  const numberToCell = (cell: { row: number; col: number }) => {
    //de posicion a nombre
    const row = cell.row;
    const col = cell.col;
    const letter = numberToLetter(col);
    return letter + row;
  };

  const cellToNumber = (cell: string) => {
    //obtener letra(s)
    const letter = cell.match(/[A-Z]+/g);
    //obtener numero(s)
    const number = cell.match(/\d+/g);
    if (letter && number) {
      const col = letterToNumber(letter[0]);
      const row = parseInt(number[0]);
      return { row, col };
    }
    return { row: 0, col: 0 };
  };

  return {
    numberToLetter,
    letterToNumber,
    numberToCell,
    cellToNumber,
  };
};
