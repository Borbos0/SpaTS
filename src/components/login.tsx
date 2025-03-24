import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../store/authSlice";
import { AppDispatch, RootState } from "../store/store";
import { TextField, Button, Grid, Paper, CircularProgress, Typography, Alert } from "@mui/material";

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { token, error } = useSelector((state: RootState) => state.auth);

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(loginUser({ username, password })).unwrap();
    } catch (err) {
      console.error("Ошибка входа:", err);
    }
    setLoading(false);
  };

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid item xs={12} sm={6} md={4}>
      <Typography variant="h6" align="center" style={{ marginBottom: "20px" }}>
        Пожалуйста авторизуйтесь
      </Typography>

        <Paper elevation={3} style={{ padding: "20px", display: "flex", flexDirection: "column" }}>
          <Typography variant="h4" gutterBottom align="center">
            Вход
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            {error && <Alert severity="error" style={{ marginTop: "10px" }}>{`Ошибка: ${error}`}</Alert>}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginTop: "20px" }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Войти"}
            </Button>
          </form>
          <Typography variant="body2" align="center" style={{ marginTop: "10px" }}>
            user1 / password
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;
