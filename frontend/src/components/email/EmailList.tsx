import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Divider,
} from "@mui/material";
import Loading from "../common/Loading";
import EmptyState from "../common/EmptyState";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import {
  getScheduledEmails,
  getSentEmails,
} from "../../api/email.api";
import { formatTime } from "../../utils/formatTime";
import Header from "../layout/Header";

export default function EmailList({ type }: any) {
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fn = type === "scheduled" ? getScheduledEmails : getSentEmails;
    fn()
      .then((res) => setEmails(res.data))
      .finally(() => setLoading(false));
  }, [type]);

  if (loading) return <Loading />;
  if (!emails.length) return <EmptyState text="No emails found" />;

  return (
    <>
    <Header></Header>
    <Box>
      {emails.map((email) => (
        <Box
          key={email.id}
          // display="flex"
          // justifyContent="space-between"
          // alignItems="center"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ width: "100%" }}
          >
            <Typography fontWeight={600}>
              To: {email.to_email.split("@")[0]}
            </Typography>

            <Box
              display="flex"
              // justifyContent="space-between"
              alignItems="center"
              sx={{ width: "70%" }}
            >

              <Chip
                label={
                  type === "scheduled"
                    ? formatTime(email.scheduled_at)
                    : "Sent"
                }
                variant={type === "scheduled" ?"":"filled"}
                color={type === "scheduled" ? "warning":""}
                size="small"
                sx={{ width: type === "scheduled" ? "10vw" : "4vw"}}

                icon={type === "scheduled" ? <AccessTimeIcon />:""}
              />
              <Typography color="text.secondary" ml={1}>
                {email.subject}
              </Typography> &nbsp; -

              <Typography
                color="text.secondary"
                ml={1}
                component="div"
                dangerouslySetInnerHTML={{ __html: email.body.substring(0, 31) + "..." }}
              />

              <Box
               display="flex"
              justifyContent="flex-end"
              alignItems="center"
              sx={{ width: "25%" }}
              >
                <StarOutlineIcon sx={{color:"lightgrey" , fontSize:"20px"}}></StarOutlineIcon>
              </Box>

            </Box>
          </Box>

          <Divider sx={{width:"100%"}} />
        </Box>
      ))}
    </Box>
    </>
  );
}
