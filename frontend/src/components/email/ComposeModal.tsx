import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Typography,
  IconButton,
  Popover,
  Box,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useState } from "react";
import { parseCSV } from "../../utils/csvParser";
import { scheduleEmail } from "../../api/email.api";
import { useAuth } from "../../auth/useAuth";

export default function ComposeModal({ open, onClose }: any) {

  const {user } = useAuth();

  const [emails, setEmails] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [to, setTo] = useState("");
  const [delay, setDelay] = useState(0);
  const [hourlyLimit, setHourlyLimit] = useState(0);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [scheduledAt, setScheduledAt] = useState<Date | null>(null);

  async function handleFile(e: any) {
    const parsed = await parseCSV(e.target.files[0]);
    setEmails(parsed);
  }

  async function submit(date?: Date) {
    await scheduleEmail({
      subject,
      body,
      emails: emails.length ? emails : [to],
      scheduledAt: date ?? new Date(),
      delayBetweenEmails: delay,
      hourlyLimit,
    });
    onClose();
  }

  const openPopover = Boolean(anchorEl);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      {/* Header */}
      <DialogTitle
        sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
      >
        <Typography fontWeight={600}>Compose New Email</Typography>

        <Stack direction="row" spacing={1}>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <AccessTimeIcon />
          </IconButton>
          <Button variant="contained" onClick={() => submit()}>
            Send
          </Button>
        </Stack>
      </DialogTitle>

      {/* Body */}
      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField
            label="From"
            value={user.user.email}
            disabled
            fullWidth
          />

<Box display="flex" alignItems="center" justifyContent="space-between" gap={2} >

          <TextField
            label="To"
            placeholder="recipient@example.com"
            onChange={(e) => setTo(e.target.value)}
            variant="standard"
            sx={{width:"85%"}}
            />
        
        
          <Stack direction="row" spacing={2} alignItems="center">
            <Button component="label" size="small"> 
              Upload List
              <input hidden type="file" onChange={handleFile} />
            </Button>
            {emails.length > 0 && (
              <Typography color="text.secondary">
                {emails.length} emails detected
              </Typography>
            )}
          </Stack>

            </Box>

          <TextField
            label="Subject"
            onChange={(e) => setSubject(e.target.value)}
            fullWidth
                        variant="standard"

          />

          <br />

          <Stack direction="row" spacing={2}>
            <TextField
              label="Delay between 2 emails"
              type="number"
              value={delay}
              onChange={(e) => setDelay(Number(e.target.value))}
              fullWidth
            />
            <TextField
              label="Hourly Limit"
              type="number"
              value={hourlyLimit}
              onChange={(e) => setHourlyLimit(Number(e.target.value))}
              fullWidth
            />
          </Stack>

          <TextField
            placeholder="Type your reply..."
            multiline
            rows={6}
            onChange={(e) => setBody(e.target.value)}
            fullWidth
          />

        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>

      {/* Send Later Popover */}
      <Popover
        open={openPopover}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Box p={2} minWidth={220}>
          <Typography fontWeight={600} mb={1}>
            Send Later
          </Typography>

          <Stack spacing={1}>
            <Button
              onClick={() => submit(new Date(Date.now() + 24 * 60 * 60 * 1000))}
            >
              Tomorrow
            </Button>
            <Button
              onClick={() =>
                submit(new Date(new Date().setHours(10, 0, 0)))
              }
            >
              Tomorrow, 10:00 AM
            </Button>
            <Button
              onClick={() =>
                submit(new Date(new Date().setHours(11, 0, 0)))
              }
            >
              Tomorrow, 11:00 AM
            </Button>
            <Button
              onClick={() =>
                submit(new Date(new Date().setHours(15, 0, 0)))
              }
            >
              Tomorrow, 3:00 PM
            </Button>

            <Button variant="outlined" onClick={() => setAnchorEl(null)}>
              Done
            </Button>
          </Stack>
        </Box>
      </Popover>
    </Dialog>
  );
}
