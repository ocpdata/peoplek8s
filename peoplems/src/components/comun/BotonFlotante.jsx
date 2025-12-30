import React from "react";
import Fab from "@mui/material/Fab";
import ChatIcon from "@mui/icons-material/Chat";
import { styled } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";

const StyledFab = styled(Fab)({
  position: "fixed",
  bottom: "2rem",
  right: "2rem",
});

export function BotonFlotante({ onClick }) {
  console.log("funcion BotonFlotante");
  return (
    <Tooltip title="Abrir chat" placement="left">
      <StyledFab color="primary" aria-label="chat" onClick={onClick}>
        <ChatIcon />
      </StyledFab>
    </Tooltip>
  );
}
