import { Sudoku } from "./sudoku.js";
import { boxSize, gridSize } from "./utilities.js";
import { convertIndexToPosition, ConvertPositionToIndex } from "./utilities.js";

const sudoku = new Sudoku();

let cells;
let selectedCellIndex;
let selectedCell;
init();

function init() {
  initCells();
  initNumbers();
  initRemover();
  initKeyEvent();
}

function initCells() {
  cells = document.querySelectorAll(".cell");
  fillCells();
  initCellsEvent();
}

function fillCells() {
  for (let i = 0; i < gridSize * gridSize; i++) {
    const { row, column } = convertIndexToPosition(i);

    if (sudoku.grid[row][column] !== null) {
      cells[i].classList.add("filled");
      cells[i].innerHTML = sudoku.grid[row][column];
    }
  }
}

function initCellsEvent() {
  cells.forEach((cell, index) => {
    cell.addEventListener("click", () => onCellClick(cell, index));
  });
}

function onCellClick(clickedCell, index) {
  cells.forEach((cell) =>
    cell.classList.remove("selected", "highLighted", "error")
  );

  if (clickedCell.classList.contains("filled")) {
    selectedCellIndex = null;
    selectedCell = null;
  } else {
    selectedCellIndex = index;
    selectedCell = clickedCell;
    clickedCell.classList.add("selected");
    highLightCellBy(index);
  }

  if (clickedCell.innerHTML === "") return;
  cells.forEach((cell) => {
    if (cell.innerHTML === clickedCell.innerHTML)
      cell.classList.add("selected");
  });
}

function highLightCellBy(index) {
  highLightColumnBy(index);
  highLightRowBy(index);
  highLightBoxBy(index);
}

function highLightColumnBy(index) {
  const column = index % gridSize;
  for (let row = 0; row < gridSize; row++) {
    const cellIndex = ConvertPositionToIndex(row, column);
    cells[cellIndex].classList.add("highLighted");
  }
}

function highLightRowBy(index) {
  const row = Math.floor(index / gridSize);
  for (let column = 0; column < gridSize; column++) {
    const cellIndex = ConvertPositionToIndex(row, column);
    cells[cellIndex].classList.add("highLighted");
  }
}

function highLightBoxBy(index) {
  const column = index % gridSize;
  const row = Math.floor(index / gridSize);
  const firstRowInBox = row - (row % boxSize);
  const firstColumnInBox = column - (column % boxSize);

  for (let iRow = firstRowInBox; iRow < firstRowInBox + boxSize; iRow++) {
    for (
      let iColumn = firstColumnInBox;
      iColumn < firstColumnInBox + boxSize;
      iColumn++
    ) {
      const cellIndex = ConvertPositionToIndex(iRow, iColumn);
      cells[cellIndex].classList.add("highLighted");
    }
  }
}

function initNumbers() {
  const numbers = document.querySelectorAll(".number");
  numbers.forEach((number) => {
    number.addEventListener("click", () =>
      onNumberClick(parseInt(number.innerHTML))
    );
  });
}

function onNumberClick(number) {
  if (!selectedCell) return;
  if (selectedCell.classList.contains("filled")) return;

  cells.forEach((cell) =>
    cell.classList.remove("error", "shake", "zoom", "selected")
  );
  selectedCell.classList.add("selected");

  setValueInSelectedCell(number);

  if (!sudoku.hasEmptyCells()) {
    setTimeout(() => winAnimation(), 500);
  }
}

function setValueInSelectedCell(value) {
  const { row, column } = convertIndexToPosition(selectedCellIndex);
  const duplicatesPositions = sudoku.getDuplicatePositions(row, column, value);
  if (duplicatesPositions.length) {
    highLightDuplicates(duplicatesPositions);
    return;
  }

  sudoku.grid[row][column] = value;
  selectedCell.innerHTML = value;
  setTimeout(() => selectedCell.classList.add("zoom"), 0);
}

function highLightDuplicates(duplicatesPositions) {
  duplicatesPositions.forEach((duplicate) => {
    const index = ConvertPositionToIndex(duplicate.row, duplicate.column);
    setTimeout(() => cells[index].classList.add("error", "shake"), 0);
  });
}

function initRemover() {
  const remover = document.querySelector(".remove");
  remover.addEventListener("click", () => onRemoveClick());
}

function onRemoveClick() {
  if (!selectedCell) return;
  if (selectedCell.classList.contains("filled")) return;

  cells.forEach((cell) =>
    cell.classList.remove("error", "shake", "zoom", "selected")
  );
  selectedCell.classList.add("selected");

  const { row, column } = convertIndexToPosition(selectedCellIndex);
  selectedCell.innerHTML = "";
  sudoku.grid[row][column] = null;
}

function initKeyEvent() {
  document.addEventListener("keydown", (event) => {
    if (event.key === "Backspace") {
      onRemoveClick();
    } else if (event.key >= "1" && event.key <= "9") {
      onNumberClick(parseInt(event.key));
    }
  });
}

function winAnimation() {
  cells.forEach((cell) =>
    cell.classList.remove("error", "shake", "zoom", "selected", "highLighted")
  );
  cells.forEach((cell, i) => {
    setTimeout(() => cell.classList.add("highLighted", "zoom"), i * 15);
  });
  for (let i = 1; i < 10; i++) {
    setTimeout(
      () => cells.forEach((cell) => cell.classList.toggle("highLighted")),
      500 + cells.length * 15 + 300 * i
    );
  }
}
