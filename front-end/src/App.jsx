import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import LandingPage  from "./pages/LandingPage";
import  LoginForm  from "./components/LoginRegister/main";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginForm />} />
        {/* <Route path="/register" element={<Register />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
