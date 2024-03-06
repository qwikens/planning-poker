export function update<T>(index: number, value: T, array: T[]): T[] {
	// Ensure the index is within the bounds of the array
	if (index < 0) {
		//biome-ignore lint: no-param-reassign
		index = array.length + index;
	}

	// Check if the index is out of bounds
	if (index >= array.length || index < 0) {
		return array;
	}

	// Create a copy of the array to avoid mutating the original
	const result = [...array];

	// Update the value at the specified index
	result[index] = value;

	return result;
}
