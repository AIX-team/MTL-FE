import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import UserLayout from "./layouts/Layout";
import Login from "./pages/user/Login";


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route path="/login" element={<Login />} />      
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;