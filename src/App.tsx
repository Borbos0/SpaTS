import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { RootState } from "./store/store";
import { logout } from "./store/authSlice";
import Login from "./components/login";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Router>
      <div>
        {token ? (
          <>
          <h2>Welcome, you are logged in!</h2>
          <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login />} />
          </Routes>
        )}
      </div>
    </Router>
  );
};

export default App;
