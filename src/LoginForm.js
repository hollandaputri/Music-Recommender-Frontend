import React, { useState } from "react";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import axios from "axios";

const LoginForm = ({ onLogin, switchToRegister }) => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/login`, form);
      onLogin(form.username);
    } catch (err) {
      setError(err.response?.data?.error || "Login gagal");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 4,
        background: "rgba(31,38,135,0.35)",
        borderRadius: 4,
        boxShadow: "0 0 32px 0 #7f53ac88",
        display: "flex",
        flexDirection: "column",
        gap: 3,
        backdropFilter: "blur(16px)",
        border: "1.5px solid #7f53ac55",
        maxWidth: 500,
        mx: "auto",
        mt: 8,
      }}
    >
      <Typography variant="h4" align="center" fontWeight={700} color="#fff" mb={2}>
        MASUK
      </Typography>
      <TextField
        label="Username"
        name="username"
        value={form.username}
        onChange={handleChange}
        fullWidth
        required
        InputProps={{
          sx: {
            borderRadius: 3,
            background: "rgba(31,38,135,0.35)", // warna gelap/transparan
            color: "#fff",
            border: "none",
            boxShadow: "none",
            "& input": { color: "#fff" }
          }
        }}
        InputLabelProps={{
          sx: { color: "#fff" },
          shrink: true
        }}
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        fullWidth
        required
        InputProps={{
          sx: {
            borderRadius: 3,
            background: "rgba(31,38,135,0.35)", // warna gelap/transparan
            color: "#fff",
            border: "none",
            boxShadow: "none",
            "& input": { color: "#fff" }
          }
        }}
        InputLabelProps={{
          sx: { color: "#fff" },
          shrink: true
        }}
      />
      {error && <Alert severity="error">{error}</Alert>}
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{
          mt: 2,
          py: 1.5,
          borderRadius: 3,
          fontWeight: 700,
          fontSize: 20,
          background: "linear-gradient(90deg, #7f53ac 0%, #5ad1e6 100%)",
          color: "#fff",
          boxShadow: "0 2px 24px #7f53ac55",
          letterSpacing: 1,
          transition: "0.2s",
          "&:hover": {
            background: "linear-gradient(90deg, #5ad1e6 0%, #7f53ac 100%)",
            boxShadow: "0 4px 32px #5ad1e655",
          },
        }}
      >
        MASUK
      </Button>
      <Button
        onClick={switchToRegister}
        fullWidth
        sx={{
          mt: 1,
          color: "#c158dc",
          fontWeight: 600,
          fontSize: 18,
          background: "none",
          boxShadow: "none",
          "&:hover": { textDecoration: "underline", background: "none" }
        }}
        disableRipple
      >
        BELUM PUNYA AKUN? DAFTAR
      </Button>
    </Box>
  );
};

export default LoginForm;
