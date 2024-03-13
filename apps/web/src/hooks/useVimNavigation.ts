import { state } from "@/store.ts";
import { useHotkeys } from "@mantine/hooks";
import { useSnapshot } from "valtio";

const useVimNavigation = () => {
  const currentIndex = useSnapshot(state).currentIndex;

  const Down = () => {
    const nextIndex = currentIndex + 1;

    const element = document.querySelector(
      `[data-vim-position="${nextIndex}"]`,
    );

    if (element instanceof HTMLElement) {
      element.focus();

      state.currentIndex = nextIndex;
      return;
    }

    state.currentIndex = currentIndex;
  };

  const Up = () => {
    const nextIndex = currentIndex - 1;

    const element = document.querySelector(
      `[data-vim-position="${nextIndex}"]`,
    );

    if (element instanceof HTMLElement) {
      element.focus();
      state.currentIndex = nextIndex;
    }

    return currentIndex;
  };

  useHotkeys([
    ["j", Down],
    ["k", Up],
    ["ArrowDown", Down],
    ["ArrowUp", Up],
  ]);

  return {
    currentIndex,
    next: Down,
    prev: Up,
  };
};

export default useVimNavigation;
