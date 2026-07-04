import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Login from "./pages/Loginn.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AddStation from "./pages/AddStation.jsx";
import ViewStation from "./pages/ViewStation.jsx";
import MapView from "./pages/MapView";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/addstation" element={<AddStation />} />
        <Route path="/viewstations" element={<ViewStation />} />
        <Route path="/map" element={<MapView />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;