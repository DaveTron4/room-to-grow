import { Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Auth from "./pages/Auth";

// Nav
import Nav from "./components/Nav";

function App() {
  return (
    <div className="min-h-screen bg-bg text-text">
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
         <Route path="/login" element={<Auth />} />
      </Routes>
    </div>
  );
}

export default App;

