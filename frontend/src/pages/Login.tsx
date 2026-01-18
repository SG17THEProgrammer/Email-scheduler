import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { login, loginWithGoogle } from "../api/auth.api";
import { useAuth } from "../auth/useAuth";
import { Box, Button, Card, Divider, TextField, Typography } from "@mui/material";
import { useState } from "react";

export default function Login() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

const [userDet, setUserDet] = useState({
  email: "",
  password: ""
});

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setUserDet(prev => ({
    ...prev,
    [name]: value
  }));
};

const handleLogin = async()=>{
  try {
    const data = await login(userDet.email , userDet.password) 
    console.log(data);
    
  } catch (error) {
    console.log(error);
  }
}


  return (
    <Box height="100vh" display="flex" justifyContent="center" alignItems="center">
      <Card sx={{ p: 4, width: 350 }}>
        <Typography variant="h5" mb={2} textAlign="center">
          Login
        </Typography>

      <Box sx={{display:'flex' , justifyContent:"center"}}>

        <GoogleLogin 
          onSuccess={async (cred) => {
            console.log(cred);
            const user = await loginWithGoogle(cred.credential!);
            setUser(user);
            navigate("/");
          }}
          />
          </Box>

        <Divider
          sx={{
            my: 3,
            color: "text.secondary",
            "&::before, &::after": {
              borderColor: "divider",
            },
          }}
        >
          <Typography variant="body2">
            or sign up through email
          </Typography>
        </Divider>

        <TextField label="Email ID" variant="outlined" fullWidth sx={{ mt: 2 }} onChange={handleInputChange}  value={userDet.email} name={"email"} disabled></TextField>
        <TextField label="Password" variant="outlined" fullWidth sx={{ mt: 2 }} onChange={handleInputChange} value={userDet.password} name={"password"} disabled></TextField>

          <Button variant="contained" fullWidth sx={{ mt: 2 }} color="success" onClick={handleLogin} disabled>
            Login
          </Button>
      </Card>
    </Box>
  );
}
