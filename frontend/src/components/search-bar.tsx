import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setSearchQuery,
  searchPokemon,
  fetchAllPokemon,
  resetFilters,
} from "../store/pokemonSlice";

const SearchBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((state) => state.pokemon.searchQuery);
  const [inputValue, setInputValue] = useState(searchQuery);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== searchQuery) {
        if (inputValue.trim()) {
          // If there's text, perform a search
          dispatch(setSearchQuery(inputValue));
          dispatch(searchPokemon(inputValue));
        } else if (searchQuery) {
          // If input is empty but searchQuery had value, reset everything
          dispatch(resetFilters());
          dispatch(fetchAllPokemon());
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, dispatch, searchQuery]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleClear = () => {
    setInputValue("");
    dispatch(resetFilters());
    dispatch(fetchAllPokemon());
  };

  return (
    <div className="relative w-full">
      <Input
        type="text"
        placeholder="Search Pokémon by name..."
        value={inputValue}
        onChange={handleChange}
        className="pr-24 w-full"
      />
      {inputValue && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 top-1/2 -translate-y-1/2"
          onClick={handleClear}
        >
          Clear
        </Button>
      )}
    </div>
  );
};

export default SearchBar;
