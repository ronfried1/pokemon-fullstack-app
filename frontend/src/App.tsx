import { Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import FavoritesPage from "./pages/FavoritesPage";

function App() {
  return (
    <Provider store={store}>
      <div className="flex min-h-screen flex-col">
        <NavBar />
        <main className="flex-1 bg-gray-50">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Routes>
        </main>
        <footer className="border-t bg-white py-4 text-center text-sm text-gray-500">
          <div className="container mx-auto px-4">
            <p>Pokémon Manager - React TypeScript App</p>
          </div>
        </footer>
      </div>
    </Provider>
  );
}

export default App;
