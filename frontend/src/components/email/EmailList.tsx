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
import { useNavigate } from "react-router-dom";
import truncate from "html-truncate";

export default function EmailList({ type }: any) {
  const navigate = useNavigate();
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fn = type === "scheduled" ? getScheduledEmails : getSentEmails;
    fn()
      .then((res) => setEmails(res.data))
      .finally(() => setLoading(false));
  }, [type]);

  if (loading) return <Loading />;
  if (!emails.length) return <EmptyState text="No emails found" setLoading={setLoading}/>;

  return (
    <>
    <Header setLoading={setLoading}></Header>
    <Box>
    <br />
      {emails.map((email) => 
      (
        <Box
          key={email.id}
          sx={{ cursor: "pointer", paddingLeft:"5px", "&:hover": { backgroundColor: "#f5f5f5"} }}
          onClick={() => navigate(`/viewMail/${email.id}`)
}
        
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ width: "100%" , height:"8vh"}}
            
          >
            <Box>

            <Typography fontWeight={600}>
              To: {email.to_email.split("@")[0]}
            </Typography>
            </Box>

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{width:"75%",}}
            >
<Box       display="flex"
              justifyContent="space-between"
              alignItems="center"         sx={{width:"auto",}}
>
              <Chip
                label={
                  type === "scheduled"
                    ? formatTime(email.scheduled_at)
                    : "Sent"
                }
                // variant={"filled"}
                variant={type === "scheduled" ?"":"filled"}
                color={type === "scheduled" ? "warning":""}
                size="small"
                sx={{ width: type === "scheduled" ? "16vw" : "4vw"}}

                icon={type === "scheduled" ? <AccessTimeIcon />:""}
              />
              <Typography color="text.secondary" ml={1}>
                {email.subject}
              </Typography> &nbsp; -

              <Typography
                color="text.secondary"
                ml={1}
                component="div"
                dangerouslySetInnerHTML={{ __html: truncate(email.body, 31, { ellipsis: "..." })}}
              />
</Box>
              <Box
               display="flex"
              justifyContent="flex-end"
              alignItems="center"
              sx={{marginRight:"20px"}}
              >
                <StarOutlineIcon sx={{color:"lightgrey" , fontSize:"20px"}}></StarOutlineIcon>
              </Box>

            </Box>
          </Box>

          <Divider sx={{width:"100%" }} />
        </Box>
      ))}
    </Box>
    </>
  );
}
