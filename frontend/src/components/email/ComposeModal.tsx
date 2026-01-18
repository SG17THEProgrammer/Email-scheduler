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
  Autocomplete,
  Chip,
  Badge,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useState } from "react";
import { parseCSV } from "../../utils/csvParser";
import { scheduleEmail } from "../../api/email.api";
import { useAuth } from "../../auth/useAuth";
import EmailEditor from "../../components/email/EmailEditor";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


export default function ComposeModal({ open, onClose }: any) {
  const { user } = useAuth();

  const [emails, setEmails] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [delay, setDelay] = useState(0);
  const [hourlyLimit, setHourlyLimit] = useState(0);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files).filter(file =>
      file.type.startsWith("image/") || file.type === "image/gif"
    );

    setAttachments(files);
  };

  async function handleFile(e: any) {
    const parsed = await parseCSV(e.target.files[0]);
    setEmails(parsed);
  }

  async function submit(date?: Date) {
    await scheduleEmail({
      subject,
      body,
      emails,
      scheduledAt: date ?? new Date(),
      delayBetweenEmails: delay,
      hourlyLimit,
    });
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      {/* Header */}
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", marginLeft: "-20px" }}>

          <ArrowBackIcon sx={{ cursor: "pointer" }} onClick={onClose}></ArrowBackIcon> &nbsp;
          <Typography fontWeight={600}>Compose New Email</Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Badge
        badgeContent={attachments.length}
        color="primary"
        overlap="circular"
      >
          <IconButton component="label">
        <AttachFileIcon />
        <input
          hidden
          type="file"
          accept="image/*,.gif"
          multiple
          onChange={handleFileChange}
        />
      </IconButton>
      </Badge>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <AccessTimeIcon />
          </IconButton>
          <Button variant="outlined" color="success" onClick={() => submit()} size="small" sx={{ borderRadius: "20px" , padding:"0 50px" }}>
            Send
          </Button>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ marginLeft: "80px" }}>
        <Stack spacing={2}>
          {/* From */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography width={60}>From</Typography>
            <TextField
              value={user.user.email}
              variant="standard"
              disabled
              fullWidth
            />
          </Stack>

          {/* To + Upload */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography width={60}>To</Typography>

            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={emails}
              onChange={(_, value) => setEmails(value)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    label={option}
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  placeholder="recipient@email.com"
                  fullWidth
                />
              )}
              sx={{ flex: 1 }}
            />

            <Button component="label" size="small" color="success">
              Upload List
              <input hidden type="file" onChange={handleFile} />
            </Button>
          </Stack>

          {/* Subject */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography width={60}>Subject</Typography>
            <TextField
              variant="standard"
              placeholder="Subject"
              fullWidth
              onChange={(e) => setSubject(e.target.value)}
            />
          </Stack>
          <br />
          {/* Delay / Hourly */}
          <Stack direction="row" spacing={3} pl={8}>
            <TextField
              label="Delay between 2 emails"
              type="number"
              size="small"
              value={delay}
              onChange={(e) => setDelay(Number(e.target.value))}
            />
            <TextField
              label="Hourly Limit"
              type="number"
              size="small"
              value={hourlyLimit}
              onChange={(e) => setHourlyLimit(Number(e.target.value))}
            />
          </Stack>

          {/* Body */}
          <Box
            sx={{
              border: "1px solid #eee",
              borderRadius: 2,
              p: 2,
              minHeight: 180,
            }}
          >
            {/* <TextField
              placeholder="Type Your Reply..."
              multiline
              rows={6}
              variant="standard"
              fullWidth
              InputProps={{ disableUnderline: true }}
              onChange={(e) => setBody(e.target.value)}
            /> */}

            <EmailEditor value={body} onChange={setBody} />

               

            {/* toolbar placeholder (icons optional) */}
          </Box>
          {attachments.length > 0 && (
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {attachments.map((file, idx) => {
            const url = URL.createObjectURL(file);
            return (
              <img
                key={idx}
                src={url}
                alt={file.name}
                style={{ width: 200, height: 150, objectFit: "cover", borderRadius: 4 , marginRight:"10px" }}
              />
            );
          })}
        </Stack>
      )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>

      {/* Send Later Popover */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Box p={2} minWidth={220}>
          <Typography fontWeight={600} mb={1}>
            Send Later
          </Typography>

            <TextField
              variant="standard"
              label="Pick date & time"
              fullWidth
              type="datetime-local"
              InputLabelProps={{
                shrink: true,
              }}
              sx={{margin:"10px 0 15px 0 "}}
            />
          <Stack spacing={1} sx={{display:"flex" , alignItems:"flex-start" , marginBottom:"50px"}}>
            <Button  size="small" onClick={() => submit(new Date(Date.now() + 86400000))}>
              Tomorrow
            </Button>
            <Button  size="small" onClick={() => submit(new Date().setHours(10, 0, 0) as any)}>
              Tomorrow, 10:00 AM
            </Button>
            <Button  size="small" onClick={() => submit(new Date().setHours(11, 0, 0) as any)}>
              Tomorrow, 11:00 AM
            </Button>
            <Button  size="small" onClick={() => submit(new Date().setHours(15, 0, 0) as any)}>
              Tomorrow, 3:00 PM
            </Button>
          </Stack>
          <Box mt={2} textAlign="right" gap={2} display="flex" justifyContent="flex-end">
                <Button size="small" >Cancel</Button>
                <Button size="small" variant="outlined" color="success" sx={{borderRadius:"30px"}}>Done</Button>

          </Box>
        </Box>
      </Popover>
    </Dialog>
  );
}
