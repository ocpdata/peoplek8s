import React, { useState, useRef, useEffect, useContext } from "react";
import Draggable from "react-draggable";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { chatIA } from "../../config/constantes.js";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { AuthContext } from "../../pages/Login";

export default function ChatApp({ onClose }) {
  const [messages, setMessages] = useState([
    { from: "bot", text: "¡Hola! ¿En qué puedo ayudarte?" },
  ]);
  const [input, setInput] = useState("");
  const { user } = useContext(AuthContext);
  const chatEndRef = useRef(null);
  const nodeRef = useRef(null);

  const handleSend = async () => {
    console.log("funcion handleSend");
    if (input.trim() === "") return;
    const userMsg = { from: "user", text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");

    try {
      // Envía el mensaje al backend IA
      console.log("urlIa:", chatIA.urlIa);
      const response = await fetch(chatIA.urlIa, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, userId: user.id }),
        //body: JSON.stringify({ message: input, userId: user.id }),
      });

      const data = await response.json();
      // Ajusta 'data.respuesta' según la estructura real de tu backend
      console.log("datos respondidos", data);
      const botMsg = {
        from: "bot",
        text: data.text || "Sin respuesta de IA.",
        //text: data.respuesta || "Sin respuesta de IA.", //Para ia sin flowise
      };
      setMessages((msgs) => [...msgs, botMsg]);
    } catch (error) {
      setMessages((msgs) => [
        ...msgs,
        { from: "bot", text: "Error al conectar con la IA." },
      ]);
    }
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <Draggable handle=".chat-drag-handle" nodeRef={nodeRef}>
      <Box
        ref={nodeRef}
        sx={{
          maxWidth: 600,
          width: "95vw",
          position: "fixed",
          top: "30%", //Para que aparezca un poco mas arriba, reducir este numero
          left: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: 4,
          p: 0,
          bgcolor: "transparent",
          zIndex: 1300,
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          backdropFilter: "blur(8px)",
        }}
      >
        {/* Barra superior moderna */}
        <Box
          className="chat-drag-handle"
          sx={{
            width: "100%",
            height: 48,
            bgcolor: "primary.main",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            boxShadow: 2,
            cursor: "move",
            position: "relative",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SmartToyIcon sx={{ mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Bot Access Quality
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              color: "#fff",
              position: "absolute",
              right: 8,
              top: 8,
            }}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Paper
          elevation={0}
          sx={{
            height: 430,
            overflowY: "auto",
            bgcolor: "rgba(255,255,255,0.85)",
            borderRadius: 0,
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            p: 2,
          }}
        >
          {messages.map((msg, idx) => (
            <Box
              key={idx}
              sx={{
                display: "flex",
                justifyContent: msg.from === "user" ? "flex-end" : "flex-start",
                my: 1,
              }}
            >
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  bgcolor: msg.from === "user" ? "primary.main" : "#e0e0e0",
                  color: msg.from === "user" ? "#fff" : "#333",
                  maxWidth: "80%",
                  wordBreak: "break-word",
                  boxShadow: 1,
                }}
              >
                <Typography variant="body2">{msg.text}</Typography>
              </Box>
            </Box>
          ))}
          <div ref={chatEndRef} />
        </Paper>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            p: 2,
            bgcolor: "rgba(255,255,255,0.85)",
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
          }}
        >
          <TextField
            placeholder="Escribe tu mensaje..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            fullWidth
            size="medium"
            sx={{
              bgcolor: "#f5f7fa",
              borderRadius: 2,
              boxShadow: 0,
            }}
          />
          <Button
            variant="contained"
            onClick={handleSend}
            sx={{ minWidth: 100 }}
          >
            Enviar
          </Button>
        </Box>
      </Box>
    </Draggable>
  );
}
