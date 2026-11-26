import { Children, cloneElement, isValidElement, useRef } from "react";
import type { KeyboardEvent, ReactElement, ReactNode } from "react";

type GroupRole = "radiogroup" | "group";

export interface SelectableCardGroupProps {
  children: ReactNode;
  role?: GroupRole;
  labelledBy?: string;
  describedBy?: string;
  className?: string;
}

const NAV_KEYS = [
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Home",
  "End",
];

interface SelectableItemProps {
  selected?: boolean;
  tabIndex?: number;
}

export function SelectableCardGroup({
  children,
  role = "group",
  labelledBy,
  describedBy,
  className,
}: SelectableCardGroupProps) {
  const groupRef = useRef<HTMLDivElement>(null);
  const items = Children.toArray(children).filter(isValidElement);
  const hasSelected = items.some((item) =>
    Boolean((item.props as SelectableItemProps).selected)
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (role !== "radiogroup" || !NAV_KEYS.includes(event.key)) {
      return;
    }

    const options = Array.from(
      groupRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]') ??
        []
    );

    if (options.length === 0) {
      return;
    }

    const currentIndex = options.indexOf(
      document.activeElement as HTMLButtonElement
    );
    let nextIndex = currentIndex;

    switch (event.key) {
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = options.length - 1;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        nextIndex = currentIndex <= 0 ? options.length - 1 : currentIndex - 1;
        break;
      case "ArrowRight":
      case "ArrowDown":
        nextIndex =
          currentIndex === -1 || currentIndex >= options.length - 1
            ? 0
            : currentIndex + 1;
        break;
    }

    event.preventDefault();

    const next = options[nextIndex];
    next.focus();
    next.click();
  };

  const rendered = items.map((item, index) => {
    if (role !== "radiogroup") {
      return item;
    }

    const props = item.props as SelectableItemProps;
    const tabIndex =
      props.tabIndex ??
      (props.selected ? 0 : !hasSelected && index === 0 ? 0 : -1);

    return cloneElement(item as ReactElement<SelectableItemProps>, {
      tabIndex,
    });
  });

  return (
    <div
      ref={groupRef}
      role={role}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      className={className}
      onKeyDown={handleKeyDown}
    >
      {rendered}
    </div>
  );
}

export default SelectableCardGroup;
