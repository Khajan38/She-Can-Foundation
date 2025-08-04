import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginRegister from "./components/LoginRegister";
import Home from "./components/Home";
import Leaderboard from "./components/Leaderboard";
import Rewards from "./components/Rewards";

function ExternalRedirect({ url }) {
  window.location.href = url;
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect to external site */}
        <Route path="/" element={<ExternalRedirect url="https://shecanfoundation.org/donate" />} />
        
        {/* Internal route */}
        <Route path="intern" element={<LoginRegister />} />
        <Route path="intern/Home" element={<Home />} />
        <Route path="intern/Rewards" element={<Rewards />} />
        <Route path="intern/Leaderboard" element={<Leaderboard />} />

        {/* Catch-all for unknown routes */}
        <Route path="*" element={<Navigate to="/intern" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
