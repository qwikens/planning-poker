export function update<T>(index: number, value: T, array: T[]): T[] {
  let updatedIndex = index;

  // Ensure the index is within the bounds of the array
  if (updatedIndex < 0) {
    updatedIndex = array.length + updatedIndex;
  }

  // Check if the index is out of bounds
  if (updatedIndex >= array.length || updatedIndex < 0) {
    return array;
  }

  // Create a copy of the array to avoid mutating the original
  const result = [...array];

  // Update the value at the specified index
  result[updatedIndex] = value;

  return result;
}
