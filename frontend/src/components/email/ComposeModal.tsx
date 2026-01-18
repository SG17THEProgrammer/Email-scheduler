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
import { useEffect, useState } from "react";
import { parseCSV } from "../../utils/csvParser";
import { scheduleEmail } from "../../api/email.api";
import { useAuth } from "../../auth/useAuth";
import EmailEditor from "../../components/email/EmailEditor";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  getScheduledEmails,
  getSentEmails,
} from "../../api/email.api";
import Loading from "../common/Loading";

export default function ComposeModal({ open, onClose }: any) {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [delay, setDelay] = useState(0);
  const [hourlyLimit, setHourlyLimit] = useState(0);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [date, setDate] = useState<Date | number>();

  // console.log(attachments);

  if (loading) return <Loading />;

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



  async function submit() {
    await scheduleEmail({
      user,
      subject,
      body,
      emails,
      scheduledAt: toLocalISO(new Date(date)) ?? toLocalISO(new Date()),
      delayBetweenEmails: delay,
      hourlyLimit,
      attachments,
    });


    setLoading(true);


    setEmails([]);
    setSubject("");
    setBody("");
    setDelay(0);
    setHourlyLimit(0);
    setAnchorEl(null);
    setAttachments([]);
    setSelected(null);
    setDate(null);

    setTimeout(() => {
      onClose();
      setLoading(false);
    }, 3000)

    getScheduledEmails();
    getSentEmails();

  }

  // async function setDate(date?: Date) {
  //   await scheduleEmail({
  //     scheduledAt: date ?? new Date(),

  //   });
  //   setAnchorEl(null);
  // }

  const handlCancel = () => {
    setAnchorEl(null);
    setSelected(null);
    setDate(null);
  }


  // useEffect(() => {
  //   getScheduledEmails();
  //   getSentEmails();
  // },[loading])

  const handleClick = (label: string, newDate: Date) => {
    if (selected === label) {
      // If already selected, unselect it
      setSelected(null);
      setDate(null); // optional, clear date as well
    } else {
      // Otherwise, select it
      setSelected(label);
      setDate(newDate);
    }
  };

  console.log(selected);

  function toLocalISO(date: Date) {
    const pad = (num: number) => num.toString().padStart(2, "0");

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); //start from 0 
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    // const milliseconds = date.getMilliseconds().toString().padStart(3, "0");

    // const offset = -date.getTimezoneOffset(); // offset in minutes
    // const sign = offset >= 0 ? "+" : "-";
    // const offsetHours = pad(Math.floor(Math.abs(offset) / 60));
    // const offsetMinutes = pad(Math.abs(offset) % 60);

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
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
            <IconButton component="label" disabled >
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
          <Button variant="outlined" color="success" onClick={() => submit()} size="small" sx={{ borderRadius: "20px", padding: "0 50px" }}>
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
                  required
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
              required
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
              disabled
            />
            <TextField
              label="Hourly Limit"
              type="number"
              size="small"
              value={hourlyLimit}
              onChange={(e) => setHourlyLimit(Number(e.target.value))}
              disabled
            />
          </Stack>

          {/* Body */}
          {/* <Box
            sx={{
              border: "1px solid #eee",
              borderRadius: 2,
              p: 2,
              minHeight: 180,
            }}
          > */}
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
          {/* </Box> */}
          {attachments.length > 0 && (
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {attachments.map((file, idx) => {
                const url = URL.createObjectURL(file);
                return (
                  <img
                    key={idx}
                    src={url}
                    alt={file.name}
                    style={{ width: 200, height: 150, objectFit: "cover", borderRadius: 4, marginRight: "10px" }}
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
            value={date ? toLocalISO(new Date(date)) : ""}
            onChange={(e) => setDate(new Date(e.target.value))}
            disabled={selected != null}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ margin: "10px 0 15px 0 " }}
          />
          <Stack spacing={1} sx={{ display: "flex", alignItems: "flex-start", marginBottom: "50px" }}>
            <Button
              size="small"
              variant={selected === "Tomorrow" ? "contained" : "text"}
              onClick={() => handleClick("Tomorrow", new Date(Date.now() + 86400000))}
            >
              Tomorrow
            </Button>

            <Button
              size="small"
              variant={selected === "Tomorrow, 10:00 AM" ? "contained" : "text"}
              onClick={() =>
                handleClick(
                  "Tomorrow, 10:00 AM",
                  new Date(new Date().setHours(10, 0, 0))
                )
              }
            >
              Tomorrow, 10:00 AM
            </Button>

            <Button
              size="small"
              variant={selected === "Tomorrow, 11:00 AM" ? "contained" : "text"}
              onClick={() =>
                handleClick(
                  "Tomorrow, 11:00 AM",
                  new Date(new Date().setHours(11, 0, 0))
                )
              }
            >
              Tomorrow, 11:00 AM
            </Button>

            <Button
              size="small"
              variant={selected === "Tomorrow, 3:00 PM" ? "contained" : "text"}
              onClick={() =>
                handleClick(
                  "Tomorrow, 3:00 PM",
                  new Date(new Date().setHours(15, 0, 0))
                )
              }
            >
              Tomorrow, 3:00 PM
            </Button>
          </Stack>
          <Box mt={2} textAlign="right" gap={2} display="flex" justifyContent="flex-end">
            <Button size="small" onClick={handlCancel}>Cancel</Button>
            <Button size="small" variant="outlined" color="success" sx={{ borderRadius: "30px" }} onClick={() => setAnchorEl(null)}>Done</Button>

          </Box>
        </Box>
      </Popover>
    </Dialog>
  );
}
