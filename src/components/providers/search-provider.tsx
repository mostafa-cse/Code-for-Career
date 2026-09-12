"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

interface SearchContextValue {
  isOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
}

const SearchContext = createContext<SearchContextValue>({
  isOpen: false,
  openSearch: () => {},
  closeSearch: () => {},
  toggleSearch: () => {},
});

export function SearchProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openSearch = useCallback(() => setIsOpen(true), []);
  const closeSearch = useCallback(() => setIsOpen(false), []);
  const toggleSearch = useCallback(() => setIsOpen((prev) => !prev), []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Toggle search on Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggleSearch();
        return;
      }

      // Close on Escape if open
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        closeSearch();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, toggleSearch, closeSearch]);

  return (
    <SearchContext.Provider
      value={{ isOpen, openSearch, closeSearch, toggleSearch }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearchModal(): SearchContextValue {
  return useContext(SearchContext);
}
