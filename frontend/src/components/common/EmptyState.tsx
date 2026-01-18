import { Typography, Box } from "@mui/material";
import Header from "../layout/Header";

export default function EmptyState({ text ,setLoading}:any) {
  return (
    <>
    <Header setLoading={setLoading}></Header>
    <Box textAlign="center" mt={4}>
      <Typography color="text.secondary">{text}</Typography>
    </Box>
    </>
  );
}
