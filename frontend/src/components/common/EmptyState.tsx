import { Typography, Box } from "@mui/material";

export default function EmptyState({ text }: { text: string }) {
  return (
    <Box textAlign="center" mt={4}>
      <Typography color="text.secondary">{text}</Typography>
    </Box>
  );
}
