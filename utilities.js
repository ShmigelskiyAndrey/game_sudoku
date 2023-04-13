export const gridSize = 9;
export const boxSize = 3;

export function convertIndexToPosition(index) {
  return {
    row: Math.floor(index / gridSize),
    column: index % gridSize,
  };
}

export function ConvertPositionToIndex(row, column) {
  return row * gridSize + column;
}
