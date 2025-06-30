import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Link } from "@mui/material";


const PopularSongs = () => {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/popular`)
      .then((res) => setSongs(res.data))
      .catch((err) => console.error("Gagal memuat lagu populer", err));
  }, []);

  return (
    <Box sx={{ mb: 10, maxWidth: 1200, mx: "auto" }}>
      <Typography
        variant="h6"
        fontWeight={700}
        gutterBottom
        sx={{
          color: "#fff",
          letterSpacing: 1,
          textShadow: "0 2px 8px #7f53ac55",
        }}
      >
        Rekomendasi Populer
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(3, 1fr)",
            md: "repeat(5, 1fr)",
          },
          gap: 3,
          justifyContent: "center",
        }}
      >
        {songs.slice(0, 15).map((song, index) => (
          <Box
            key={index}
            sx={{
              background: "rgba(31,38,135,0.25)",
              borderRadius: 4,
              boxShadow: "0 4px 24px #7f53ac33",
              border: "1.5px solid #7f53ac55",
              p: 2,
              textAlign: "center",
              transition: "all 0.25s cubic-bezier(.4,2,.3,1)",
              backdropFilter: "blur(8px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              "&:hover": {
                boxShadow: "0 8px 32px #5ad1e655",
                background: "rgba(90,209,230,0.18)",
                borderColor: "#5ad1e6",
                transform: "translateY(-2px) scale(1.03)",
              },
            }}
          >
            <Link
              href={song.spotify_url}
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
              color="inherit"
              sx={{ width: "100%" }}
            >
              <Box
                component="img"
                src={song.image_url}
                alt={song.name}
                sx={{
                  width: "100%",
                  height: 140,
                  objectFit: "cover",
                  borderRadius: 3,
                  mb: 1,
                  boxShadow: "0 2px 16px #7f53ac44",
                  border: "1.5px solid #fff2",
                  transition: "box-shadow 0.2s, border 0.2s",
                  "&:hover": {
                    boxShadow: "0 4px 32px #5ad1e655",
                    border: "1.5px solid #5ad1e6",
                  },
                }}
              />
              <Typography
                variant="body2"
                fontWeight={700}
                noWrap
                sx={{
                  mb: 0.5,
                  color: "#fff",
                  textShadow: "0 1px 8px #7f53ac33",
                  fontSize: 16,
                  letterSpacing: 0.5,
                }}
              >
                {song.name}
              </Typography>
              <Typography
                variant="caption"
                color="#b2b2b2"
                noWrap
                sx={{
                  fontWeight: 500,
                  textShadow: "0 1px 8px #7f53ac33",
                  fontSize: 13,
                }}
              >
                – {song.artists}
              </Typography>
            </Link>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PopularSongs;
