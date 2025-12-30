import Backdrop from "@mui/material/Backdrop";
import { IconoLoader } from "./IconoLoader";

export function BackdropPantalla({ open, texto }) {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
    >
      <IconoLoader texto={texto} />
    </Backdrop>
  );
}
