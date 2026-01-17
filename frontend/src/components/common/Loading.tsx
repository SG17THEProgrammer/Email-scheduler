import { CircularProgress, Box } from "@mui/material";

export default function Loading() {
  return (
    <Box display="flex" justifyContent="center" mt={4}>
      <CircularProgress />
    </Box>
  );
}
