import React from "react";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { RootState } from "./store/store";
import Login from "./components/login";
import DataTable from "./components/table";

const App: React.FC = () => {
  const token = useSelector((state: RootState) => state.auth.token);

  return (
    <Router>
      <Routes>
        {!token ? (
          <Route path="*" element={<Navigate to="/login" />} />
        ) : (
          <Route path="/" element={<DataTable />} />
        )}
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
