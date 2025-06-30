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

const MusicIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <path d="M9 17V5l12-2v12" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="6" cy="18" r="3" stroke="#fff" strokeWidth="2.2"/>
    <circle cx="18" cy="16" r="3" stroke="#fff" strokeWidth="2.2"/>
  </svg>
);

const WaveIcon = () => (
  <svg width="38" height="32" viewBox="0 0 32 28" fill="none">
    <rect x="2" y="10" width="2" height="8" rx="1" fill="#fff"/>
    <rect x="7" y="6" width="2" height="16" rx="1" fill="#fff"/>
    <rect x="12" y="2" width="2" height="24" rx="1" fill="#fff"/>
    <rect x="17" y="6" width="2" height="16" rx="1" fill="#fff"/>
    <rect x="22" y="10" width="2" height="8" rx="1" fill="#fff"/>
  </svg>
);

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
    axios.get("http://127.0.0.1:5000/lagu")
      .then((res) => {
        setSongOptions(res.data);
        const uniqueArtists = [...new Set(res.data.map((song) => song.artist))];
        setArtistOptions(uniqueArtists);
      })
      .catch((err) => console.error("Gagal mengambil lagu:", err));

    axios.get(`http://127.0.0.1:5000/get_user_ratings/${user}`)
      .then((res) => setUserRatings(res.data))
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
      const res = await axios.post("http://127.0.0.1:5000/recommend", {
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
      : <LoginForm onLogin={setUser} switchToRegister={() => setShowRegister(true)} />;
  }

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #181c2f 60%, #7f53ac 100%)", py: 6, position: "relative", overflow: "hidden" }}>
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={{ position: "absolute", top: 0, right: 0, zIndex: 2 }}>
          <IconButton onClick={handleLogout} sx={{ color: "#fff", background: "rgba(127,83,172,0.15)", border: "1.5px solid #7f53ac55", boxShadow: "0 2px 8px #7f53ac55", "&:hover": { background: "#7f53ac" } }}>
            <LogoutIcon />
          </IconButton>
        </Box>

        <Box sx={{ textAlign: "center", mt: 4, mb: 2 }}>
          <Typography variant="h3" fontWeight={700} sx={{ letterSpacing: 2, color: "#fff", textShadow: "0 2px 16px #7f53ac55" }}>SISTEM REKOMENDASI LAGU</Typography>
          <Typography variant="subtitle1" sx={{ fontStyle: "italic", color: "#b2b2b2", fontWeight: 500, letterSpacing: 1, mt: 1 }}>temukan lagu sesuai seleramu</Typography>
          <Typography variant="subtitle2" sx={{ color: "#fff", fontWeight: 500, mt: 2, mb: 1, fontSize: 18 }}>Selamat datang, {user}!</Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ background: "rgba(31,38,135,0.25)", p: 4, borderRadius: 5, boxShadow: "0 8px 32px 0 #7f53ac55", mb: 4, display: "flex", flexDirection: "column", gap: 2, backdropFilter: "blur(12px)", border: "1.5px solid #7f53ac55" }}>
          <TextField label="User ID *" name="user_id" value={formData.user_id} fullWidth required InputProps={{ sx: { borderRadius: 3, background: "transparent", color: "#fff", "& input": { color: "#fff" } }, readOnly: true }} InputLabelProps={{ sx: { color: "#fff" } }} />

          <Autocomplete options={artistOptions} getOptionLabel={(option) => option} renderInput={(params) => (
            <TextField {...params} label="Artis *" required InputProps={{ ...params.InputProps, sx: { borderRadius: 3, background: "transparent", color: "#fff", "& input": { color: "#fff" } } }} InputLabelProps={{ sx: { color: "#fff" } }} />
          )} onChange={(e, value) => {
            setFormData((prev) => ({ ...prev, artis: value || "", judul_lagu: "" }));
            const filtered = songOptions.filter((song) => song.artist === value);
            setFilteredSongs(filtered);
          }} value={formData.artis} />

          <Autocomplete options={filteredSongs} getOptionLabel={(option) => option.title || ""} isOptionEqualToValue={(option, value) => option.title === value.title} renderInput={(params) => (
            <TextField {...params} label="Judul Lagu *" required InputProps={{ ...params.InputProps, sx: { borderRadius: 3, background: "transparent", color: "#fff", "& input": { color: "#fff" } } }} InputLabelProps={{ sx: { color: "#fff" } }} />
          )} onChange={(e, value) => {
            if (value) setFormData((prev) => ({ ...prev, judul_lagu: value.title }));
            else setFormData((prev) => ({ ...prev, judul_lagu: "" }));
          }} disabled={!formData.artis} value={filteredSongs.find((song) => song.title === formData.judul_lagu) || null} />

          <TextField select label="Genre *" name="genre" value={formData.genre} onChange={handleChange} fullWidth required InputProps={{ sx: { borderRadius: 3, background: "transparent", color: "#fff", "& input": { color: "#fff" } } }} InputLabelProps={{ sx: { color: "#fff" } }}>
            {genreOptions.map((genre) => (<MenuItem key={genre} value={genre}>{genre.toUpperCase()}</MenuItem>))}
          </TextField>

          <TextField label="Jumlah Rekomendasi (top_n)" name="top_n" type="number" inputProps={{ min: 1, max: 20 }} value={formData.top_n} onChange={handleChange} fullWidth InputProps={{ sx: { borderRadius: 3, background: "transparent", color: "#fff", "& input": { color: "#fff" } } }} InputLabelProps={{ sx: { color: "#fff" } }} />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, py: 1.5, borderRadius: 3, fontWeight: 700, fontSize: 18, background: "linear-gradient(90deg, #7f53ac 60%, #5ad1e6 100%)", color: "#fff", boxShadow: "0 2px 16px #7f53ac55", letterSpacing: 1, "&:hover": { background: "linear-gradient(90deg, #5ad1e6 60%, #7f53ac 100%)", boxShadow: "0 4px 24px #5ad1e655" } }} disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : "Get Recommendation"}
          </Button>
        </Box>

        {error && (<Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>)}

        {results.length > 0 && (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" fontWeight={700} gutterBottom sx={{ letterSpacing: 1, color: "#fff", textShadow: "0 2px 8px #7f53ac55" }}>
      Hasil Rekomendasi
    </Typography>
    {results.map((item, idx) => {
      const songKey = `${item["Judul Lagu"]} - ${item.Artis}`;
      return (
        <Box
          key={idx}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(31,38,135,0.35)",
            borderRadius: 3,
            px: 2,
            py: 1.5,
            mb: 2,
            cursor: "pointer",
            boxShadow: "0 2px 12px #7f53ac33",
            border: "1.5px solid #7f53ac55",
            transition: "all 0.25s cubic-bezier(.4,2,.3,1)",
            "&:hover": {
              background: "rgba(90,209,230,0.25)",
              boxShadow: "0 4px 24px #5ad1e655",
              transform: "translateY(-2px) scale(1.01)",
              borderColor: "#5ad1e6"
            }
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }} onClick={() => window.open(item.spotify_url, "_blank")}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 17V5l12-2v12" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="6" cy="18" r="3" stroke="#fff" strokeWidth="2.2"/>
                <circle cx="18" cy="16" r="3" stroke="#fff" strokeWidth="2.2"/>
              </svg>
              <svg width="30" height="24" viewBox="0 0 32 28" fill="none" style={{ marginLeft: 4 }}>
                <rect x="2" y="10" width="2" height="8" rx="1" fill="#fff"/>
                <rect x="7" y="6" width="2" height="16" rx="1" fill="#fff"/>
                <rect x="12" y="2" width="2" height="24" rx="1" fill="#fff"/>
                <rect x="17" y="6" width="2" height="16" rx="1" fill="#fff"/>
                <rect x="22" y="10" width="2" height="8" rx="1" fill="#fff"/>
              </svg>
            </Box>
            <Typography variant="body1" fontWeight={600} sx={{ fontSize: 18, color: "#fff", textShadow: "0 1px 8px #7f53ac33" }}>
              {songKey}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <Rating
              name={`rating-${idx}`}
              size="medium"
              value={userRatings[songKey] || 0}
              onChange={(_, newValue) => {
                if (newValue) {
                  axios.post("http://127.0.0.1:5000/rate", {
                    user: user,
                    song: songKey,
                    rating: newValue
                  }).then(() => {
                    setUserRatings(prev => ({
                      ...prev,
                      [songKey]: newValue
                    }));
                  }).catch((err) => console.error("Gagal menyimpan rating", err));
                }
              }}
              sx={{ mb: 0.5 }}
            />
            <Typography variant="caption" sx={{ fontSize: 12, color: "#fff", fontWeight: 500, opacity: 0.8 }}>
              Skor: {item["Skor Hybrid"]?.toFixed(3)}
            </Typography>
          </Box>
        </Box>
      );
    })}
              <Button
              variant="outlined"
              onClick={() => {
                setShowRecommendation(false);
                setResults([]);
                setFormData((prev) => ({ ...prev, judul_lagu: "", artis: "", genre: "" }));
              }}
              sx={{
                mt: 2,
                px: 4,
                py: 1.2,
                fontSize: 16,
                fontWeight: 600,
                borderRadius: 3,
                color: "#fff",
                borderColor: "#5ad1e6",
                background: "transparent",
                "&:hover": {
                  background: "#5ad1e633",
                  borderColor: "#7f53ac",
                }
              }}
            >
              Selesai
            </Button>
          </Box>
        )}

        <Box mt={6}><PopularSongs /></Box>
      </Container>
    </Box>
  );
}

export default App;
