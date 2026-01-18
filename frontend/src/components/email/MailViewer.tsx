import {
  Box,
  Typography,
  Stack,
  Avatar,
  IconButton,
  Divider,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getEmailById, getSenderById } from "../../api/email.api";
import { useAuth } from "../../auth/useAuth";
import { formatTime } from "../../utils/formatTime";

interface Mail {
  id: string;
  sender_id: number;
  subject: string;
  name: string;
  email: string;
  to_email: string;
  date: string;
  body: string;
  created_at: string;
  attachments?: any[];
}

interface Sender {
  id: number;
  name: string;
  email: string;
}

export default function MailViewer() {
    const {user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [mail, setMail] = useState<Mail | null>(null);
  const [sender, setSender] = useState<Sender | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function fetchMail() {
      try {
        setLoading(true);
        console.log(id);
        const res = await getEmailById(id);
        console.log(res);
        setMail(res.data[0]);
      } catch (err) {
        setError("Failed to load email");
      } finally {
        setLoading(false);
      }
    }

    fetchMail();
  }, [id]);

  useEffect(() => {
    if (!mail?.sender_id) return;

    async function getSender() {
      try {
        setLoading(true);
        console.log(mail?.sender_id);
        const res = await getSenderById(mail!.sender_id.toString());
        console.log(res);
        setSender(res.data[0]); 
      } catch (err) {
        setError("Failed to load sender");
      } finally {
        setLoading(false);
      }
    }

    getSender();
  }, [mail?.sender_id]);


  if (loading) {
    return (
      <Box height="100%" display="flex" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !mail) {
    return (
      <Box p={4}>
        <Typography color="error">{error || "Mail not found"}</Typography>
      </Box>
    );
  }



  return (
    <Box height="100%" bgcolor="#fff">
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={1} px={2} py={1}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>

        <Typography fontWeight={600} flex={1} noWrap>
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
      <Stack direction="row" spacing={2} px={3} py={2} sx={{margin:"0 100px"}}>
        <Avatar sx={{ bgcolor: "#22c55e" }}>
          {sender?.name?.charAt(0).toUpperCase()}
        </Avatar>

        <Box flex={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography fontWeight={600}>{sender?.name}</Typography>
            <Typography color="text.secondary">
              &lt;{sender?.email}&gt;
            </Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            to {mail?.to_email.trim() === user?.user?.email.trim() ? "me" : mail?.to_email}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary">
          {formatTime(mail.created_at)}
        </Typography>
      </Stack>

      {/* Body */}
      <Box px={6} py={2} sx={{margin:"0 130px"}}>
        <Box
          sx={{
            "& p": { mb: 2 },
            "& strong": { fontWeight: 600 },
          }}
          dangerouslySetInnerHTML={{ __html: mail.body }}
        />
      </Box>

      {/* Attachments */}
      
      {/* {mail.attachments?.length > 0 && (
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
      )} */}
    </Box>
  );
}
