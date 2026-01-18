import {
  Box,
  Typography,
  Stack,
  Avatar,
  IconButton,
  Divider,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ImageIcon from "@mui/icons-material/Image";

interface Attachment {
  name: string;
  size: string;
  url: string;
}

interface MailViewerProps {
  mail: {
    subject: string;
    fromName: string;
    fromEmail: string;
    to: string;
    date: string;
    bodyHtml: string;
    attachments?: Attachment[];
  };
  onBack: () => void;
}

export default function MailViewer({ mail, onBack }: MailViewerProps) {
  return (
    <Box sx={{ height: "100%", backgroundColor: "#fff" }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={1} px={2} py={1}>
        <IconButton onClick={onBack}>
          <ArrowBackIcon />
        </IconButton>

        <Typography fontWeight={600} flex={1}>
          {mail.subject}
        </Typography>

        <IconButton>
          <StarBorderIcon />
        </IconButton>
        <IconButton>
          <DeleteOutlineIcon />
        </IconButton>
        <IconButton>
          <MoreVertIcon />
        </IconButton>
      </Stack>

      <Divider />

      {/* Sender Info */}
      <Stack direction="row" spacing={2} px={3} py={2} alignItems="flex-start">
        <Avatar sx={{ bgcolor: "#22c55e" }}>
          {mail.fromName.charAt(0)}
        </Avatar>

        <Box flex={1}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography fontWeight={600}>{mail.fromName}</Typography>
            <Typography color="text.secondary">
              &lt;{mail.fromEmail}&gt;
            </Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            to {mail.to}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary">
          {mail.date}
        </Typography>
      </Stack>

      {/* Body */}
      <Box px={6} py={2}>
        {/* Rendered HTML body */}
        <Box
          sx={{
            "& p": { mb: 2 },
            "& strong": { fontWeight: 600 },
          }}
          dangerouslySetInnerHTML={{ __html: mail.bodyHtml }}
        />
      </Box>

      {/* Attachments */}
      {mail.attachments && mail.attachments.length > 0 && (
        <Box px={6} pb={4}>
          <Stack direction="row" spacing={2}>
            {mail.attachments.map((file, idx) => (
              <Box
                key={idx}
                sx={{
                  width: 180,
                  border: "1px solid #e5e7eb",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    height: 120,
                    bgcolor: "#f3f4f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ImageIcon fontSize="large" color="action" />
                </Box>

                <Box p={1}>
                  <Typography variant="body2" noWrap>
                    {file.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {file.size}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
}
