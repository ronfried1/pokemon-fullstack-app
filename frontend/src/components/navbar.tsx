import React from "react";
import { NavLink } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";

const NavBar: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <h1 className="mr-6 text-xl font-bold text-foreground">
            Pokémon Manager
          </h1>

          <nav className="flex space-x-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted ${
                  isActive ? "bg-muted text-foreground" : "text-foreground/80"
                }`
              }
              end
            >
              All Pokémon
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center space-x-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export default NavBar;
