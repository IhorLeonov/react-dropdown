import { useState, useRef, useEffect, type ReactNode } from "react";
import { cn } from "../lib/utils";

type DropdownProps<T> = {
  options: T[];
  selected?: T | null;
  onSelect?: (option: T) => void;
  customOption?: (option: T) => ReactNode;
  customSelected?: (option: T | null) => ReactNode;
  searchFunction?: (query: string) => Promise<T[]> | T[];
  placeholder?: string;
  className?: string;
  noResultsText?: string;
  buttonClassName?: string;
  contentClassName?: string;
  searchContainerClass?: string;
  inputClassName?: string;
  itemClassName?: string;
  searchPlaceholder?: string;
};

export function Dropdown<T extends { label: string; value: number | string }>(
  props: DropdownProps<T>,
) {
  const {
    className,
    options,
    selected,
    onSelect,
    customOption,
    customSelected,
    searchFunction,
    placeholder = "Select...",
    noResultsText = "No results",
    buttonClassName,
    contentClassName,
    searchContainerClass,
    inputClassName,
    itemClassName,
    searchPlaceholder = "Search...",
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<T[]>(options);

  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter options
  useEffect(() => {
    let active = true;
    const fetchFiltered = async () => {
      if (searchFunction) {
        const result = await searchFunction(query);
        if (active) setFilteredOptions(result);
      } else {
        setFilteredOptions(
          options.filter((o) =>
            o.label.toLowerCase().includes(query.toLowerCase()),
          ),
        );
      }
    };

    fetchFiltered();
    return () => {
      active = false;
    };
  }, [query, options, searchFunction]);

  const handleSelect = (option: T) => {
    onSelect?.(option);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div
      className={cn("relative inline-block w-[295px] text-[14px]", className)}
      ref={ref}
    >
      <button
        type="button"
        className={cn(
          "flex w-full items-center justify-between rounded-[8px] border border-[#D1D5DB] bg-[#F9FAFB] px-4 py-3 text-left text-[#999999] hover:border-[#666666] focus:outline-none",
          isOpen && "rounded-b-none border-b-0 border-[#666666]",
          buttonClassName,
        )}
        onMouseDown={(e) => {
          e.preventDefault();
          setIsOpen((prev) => !prev);
        }}
        onBlur={() => setIsOpen(false)}
        onFocus={() => {
          if (!isOpen) setIsOpen(true);
        }}
      >
        {customSelected
          ? customSelected(selected ?? null)
          : (selected?.label ?? placeholder)}

        <svg
          width="8"
          height="6"
          viewBox="0 0 8 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 6L0 0H8L4 6Z" fill="#333333" />
        </svg>
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute z-10 max-h-60 w-full overflow-auto rounded-b-[8px] border bg-white pt-[10px] pb-4",
            contentClassName,
          )}
        >
          <div className={cn("w-full px-[10px]", searchContainerClass)}>
            <input
              type="text"
              className={cn(
                "w-full rounded-[6px] border border-[#d1d5db99] bg-[#f9fafb99] px-[8px] py-1 text-[#6B7280] focus:outline-none",
                inputClassName,
              )}
              placeholder={searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <ul className="mt-3 text-[#6B7280] [&_li]:px-4 [&_li]:leading-[1.5]">
            {filteredOptions.map((option, i) => (
              <li
                key={i}
                className={cn(
                  "cursor-pointer hover:bg-[#F5F5F5]",
                  itemClassName,
                )}
                onClick={() => handleSelect(option)}
              >
                {customOption ? customOption(option) : option.label}
              </li>
            ))}
            {filteredOptions.length === 0 && (
              <li className="text-center">{noResultsText}</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
