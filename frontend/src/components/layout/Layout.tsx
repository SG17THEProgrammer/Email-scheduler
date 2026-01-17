import {
  Box,
  Button,
  Avatar,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Chip,
} from "@mui/material";
import { useAuth } from "../../auth/useAuth";
import type { User } from "../../types/auth.types";
import TelegramIcon from '@mui/icons-material/Telegram';
// import Header from "./Header";
import {
  getScheduledEmails,
  getSentEmails,
} from "../../api/email.api";
import { useEffect, useState } from "react";
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function Layout({
  children,
  folder,
  onFolderChange,
  onCompose,
}: any) {

const { user , setUser} = useAuth();

const data = user as unknown as { user: User };

const email = data.user.email;
const name = data.user.name;
const avatar = data.user.avatar;


   const [scheduledCount, setScheduledCount] = useState(0);
  const [sentCount, setSentCount] = useState(0);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [scheduledRes, sentRes] = await Promise.all([
          getScheduledEmails(),
          getSentEmails(),
        ]);

        setScheduledCount(scheduledRes.data.length);
        setSentCount(sentRes.data.length);
      } catch (err) {
        console.error("Failed to fetch email counts", err);
      }
    }

    fetchCounts();
  }, []);


  return (
    <Box display="flex" height="100vh">
      {/* Sidebar */}
      <Box width={260} p={2} borderRight="1px solid #eee">
        <Box display="flex" alignItems="flex-start" gap={1} mb={3} justifyContent="flex-start" flexDirection='column'>
          <Box display="flex" alignItems="center" gap={3}justifyContent="space-between">

                  <Typography variant="h6">Email Scheduler</Typography>
    <Button
              color="error"
              variant="outlined"
              size="small"
              onClick={() => setUser(null)}
              >
              Logout
            </Button>
              </Box>
                   <Box display="flex" alignItems="center" gap={1} sx={{backgroundColor:"lightgrey" , padding:"10px" , borderRadius:"20px"}}>
      <Avatar src={avatar} />
      <Box>
        <Typography fontWeight={600}>{name}</Typography>
        <Typography variant="caption" color="text.secondary">
        {email}
        </Typography>
      </Box>
    </Box>
        </Box>

        <Button
          fullWidth
          variant="outlined"
          sx={{ mb: 2, borderRadius: 5 }}
          onClick={onCompose}
        >
          Compose
        </Button>

        <Typography variant="caption" color="text.secondary">
          CORE
        </Typography>

        <List>
          <ListItemButton sx={{display:"flex" , justifyContent:"center"}}
            selected={folder === "scheduled"}
            onClick={() => onFolderChange("scheduled")}
          >
            <AccessTimeIcon></AccessTimeIcon> &nbsp;&nbsp;
            <ListItemText primary="Scheduled" />
             <Chip label={scheduledCount} size="small" variant="outlined" />
          </ListItemButton>

          <ListItemButton sx={{display:"flex" , justifyContent:"center"}}
            selected={folder === "sent"}
            onClick={() => onFolderChange("sent")}
            >
            <TelegramIcon></TelegramIcon> &nbsp; &nbsp;
            <ListItemText primary="Sent" />
                         <Chip label={sentCount} size="small" variant="outlined" />

          </ListItemButton>
        </List>
      </Box>

      {/* Main content */}
      <Box flex={1} p={3}>
        {children}
      </Box>
    </Box>
  );
}
