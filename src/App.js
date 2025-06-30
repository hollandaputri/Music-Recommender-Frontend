// App.js
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Box,
  Autocomplete,
  MenuItem,
  IconButton,
  Rating,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import PopularSongs from "./PopularSongs";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL;

function App() {
  const [user, setUser] = useState(localStorage.getItem("user") || null);
  const [showRegister, setShowRegister] = useState(false);
  const [formData, setFormData] = useState({ user_id: "", judul_lagu: "", artis: "", genre: "", top_n: 10 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);
  const [songOptions, setSongOptions] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [artistOptions, setArtistOptions] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [showRecommendation, setShowRecommendation] = useState(false);

  const genreOptions = ["classical", "edm", "hiphop", "jazz", "indie", "latin", "kpop", "pop", "rnb", "rock", "ipop"];

  useEffect(() => {
    if (!user) return;

    axios.get(`${API_BASE}/lagu`)
      .then((res) => {
        setSongOptions(res.data || []);
        const uniqueArtists = [...new Set(res.data.map((song) => song.artist))];
        setArtistOptions(uniqueArtists);
      })
      .catch((err) => console.error("Gagal mengambil lagu:", err));

    axios.get(`${API_BASE}/get_user_ratings/${user}`)
      .then((res) => setUserRatings(res.data || {}))
      .catch(() => setUserRatings({}));
  }, [user]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({ ...prev, user_id: user }));
    }
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setFormData({ user_id: "", judul_lagu: "", artis: "", genre: "", top_n: 10 });
    setResults([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResults([]);
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/recommend`, {
        ...formData,
        top_n: parseInt(formData.top_n),
      });
      setResults(res.data.recommendations || res.data);
      setShowRecommendation(true);
    } catch (err) {
      setError(err.response?.data?.error || "Server Error");
    }

    setLoading(false);
  };

  if (!user) {
    return showRegister
      ? <RegisterForm switchToLogin={() => setShowRegister(false)} onRegisterSuccess={() => setShowRegister(false)} />
      : <LoginForm onLogin={(username) => {
          setUser(username);
          localStorage.setItem("user", username);
        }} switchToRegister={() => setShowRegister(true)} />;
  }

  // ... UI di bawah tidak berubah, langsung salin saja dari versi kamu karena sudah rapi

  return (
    <Box sx={{ background: "#111", minHeight: "100vh", color: "#fff", py: 4 }}>
      <Container maxWidth="sm">
        <Box sx={{ position: "absolute", top: 20, right: 20 }}>
          <IconButton onClick={handleLogout} sx={{ color: "#fff" }}>
            <LogoutIcon />
          </IconButton>
        </Box>

        {/* ... (UI bagian atas dan form rekomendasi tidak diubah) */}

        {results.length > 0 && (
          <Box>
            <Typography variant="h6">Hasil Rekomendasi:</Typography>
            {results.map((item, idx) => {
              const songKey = `${item["Judul Lagu"]} - ${item.Artis}`;
              return (
                <Box key={idx} sx={{ my: 2 }}>
                  <Typography>{songKey}</Typography>
                  <Rating
                    value={userRatings[songKey] || 0}
                    onChange={(_, value) => {
                      if (value) {
                        axios.post(`${API_BASE}/rate`, {
                          user,
                          song: songKey,
                          rating: value,
                        }).then(() => {
                          setUserRatings((prev) => ({
                            ...prev,
                            [songKey]: value
                          }));
                        });
                      }
                    }}
                  />
                  <Typography variant="caption">Skor: {item["Skor Hybrid"]?.toFixed(3)}</Typography>
                </Box>
              );
            })}
          </Box>
        )}

        <Box mt={6}><PopularSongs /></Box>
      </Container>
    </Box>
  );
}

export default App;
