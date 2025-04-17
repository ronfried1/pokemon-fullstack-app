import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setSearchQuery } from "../store/pokemonSlice";

const SearchBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((state) => state.pokemon.searchQuery);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleClear = () => {
    dispatch(setSearchQuery(""));
  };

  return (
    <div className="relative mb-6">
      <Input
        type="text"
        placeholder="Search Pokémon by name or type..."
        value={searchQuery}
        onChange={handleChange}
        className="pr-24"
      />
      {searchQuery && (
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
