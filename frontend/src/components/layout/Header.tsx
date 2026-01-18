import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  getScheduledEmails,
  getSentEmails,
} from "../../api/email.api";
export default function Header({setLoading}: any) {

  const handleRefresh = () => {
    setLoading(true);
    getScheduledEmails();
    getSentEmails();
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }

  return (
    <TextField
      placeholder="Search"
      size="small"
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: (
          <>
            <InputAdornment position="end">
              <IconButton edge="end" size="small" aria-label="filter">
                <FilterListIcon />
              </IconButton>
            </InputAdornment>
            <InputAdornment position="end">
              <IconButton edge="end" size="small" aria-label="refresh">
                <RefreshIcon onClick={handleRefresh} />
              </IconButton>
            </InputAdornment>
          </>
        ),
      }}
      sx={{
        bgcolor: "#f7f7f7",
        borderRadius: 5,
        "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
      }}
    />
  );
}
