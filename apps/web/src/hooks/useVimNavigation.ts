import { useHotkeys } from "@mantine/hooks";
import { useState } from "react";

const useVimNavigation = () => {
	const [currentIndex, setCurrentIndex] = useState(0);

	const Down = () => {
		setCurrentIndex((prevIndex) => {
			const nextIndex = prevIndex + 1;

			const element = document.querySelector(
				`[data-vim-position="${nextIndex}"]`,
			);

			if (element instanceof HTMLElement) {
				element.focus();
				return nextIndex;
			}

			return prevIndex;
		});
	};

	const Up = () => {
		setCurrentIndex((prevIndex) => {
			const nextIndex = prevIndex - 1;

			const element = document.querySelector(
				`[data-vim-position="${nextIndex}"]`,
			);

			if (element instanceof HTMLElement) {
				element.focus();
				return nextIndex;
			}

			return prevIndex;
		});
	};

	useHotkeys([
		["j", Down],
		["k", Up],
		["ArrowDown", Down],
		["ArrowUp", Up],
	]);

	return currentIndex;
};

export default useVimNavigation;
