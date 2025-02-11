import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Dex from "./pages/Dex";
import Swap from "./pages/Swap";
import Search from "./pages/Search";
import Marketplace from "./pages/Marketplace";

const App: React.FC = () => {
  return (
    <div className="min-h-screen">
      <header className="p-4 bg-blue-600 text-white">
        <h1 className="text-xl font-bold">Cerebra DEX</h1>
        <nav className="mt-2 space-x-4">
          <Link className="hover:underline" to="/">
            Home
          </Link>
          <Link className="hover:underline" to="/dex">
            DEX
          </Link>
          <Link className="hover:underline" to="/swap">
            Swap
          </Link>
          <Link className="hover:underline" to="/search">
            Search
          </Link>
          <Link className="hover:underline" to="/marketplace">
            Marketplace
          </Link>
        </nav>
      </header>
      <main className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dex" element={<Dex />} />
          <Route path="/swap" element={<Swap />} />
          <Route path="/search" element={<Search />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
