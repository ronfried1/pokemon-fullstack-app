import React from "react";
import { NavLink } from "react-router-dom";
import { Button } from "./ui/button";
import { useAppSelector } from "../store/hooks";

const NavBar: React.FC = () => {
  const favorites = useAppSelector((state) => state.favorites.list);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <h1 className="mr-6 text-xl font-bold">Pokémon Manager</h1>
          <nav className="flex space-x-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isActive ? "bg-gray-100 dark:bg-gray-700 dark:text-white" : ""
                }`
              }
              end
            >
              All Pokémon
            </NavLink>
            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                `inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isActive ? "bg-gray-100 dark:bg-gray-700 dark:text-white" : ""
                }`
              }
            >
              Favorites
              {favorites.length > 0 && (
                <span className="ml-1 rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white">
                  {favorites.length}
                </span>
              )}
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              document.documentElement.classList.toggle("dark");
            }}
            title="Toggle theme"
            size="icon"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <circle cx="12" cy="12" r="4"></circle>
              <path d="M12 2v2"></path>
              <path d="M12 20v2"></path>
              <path d="m4.93 4.93 1.41 1.41"></path>
              <path d="m17.66 17.66 1.41 1.41"></path>
              <path d="M2 12h2"></path>
              <path d="M20 12h2"></path>
              <path d="m6.34 17.66-1.41 1.41"></path>
              <path d="m19.07 4.93-1.41 1.41"></path>
            </svg>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
