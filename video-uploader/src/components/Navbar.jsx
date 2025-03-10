import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = ({ title, navigationBtn }) => {
  const navigate = useNavigate();

  const goWhere = () => {
    console.log("Btn click", navigationBtn);
    if (navigationBtn == "Uploader") {
      navigate("/home");
      console.log("BTNNN");
    }
  };

  const testingDb = async () => {
    const response = await axios.get("http://127.0.0.1:5000/test");
    console.log("Response for test: ", response);
  };

  const testingCreateDb = async () => {
    const response = await axios.get("http://127.0.0.1:5000/createDb");
    console.log("Response for CreateDB: ", response);
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {title}
            </Typography>
            <Button color="inherit" variant="outlined" onClick={testingDb}>
              Testing
            </Button>
            <Button color="inherit" variant="outlined" onClick={testingCreateDb}>
              CreateDB
            </Button>

            {navigationBtn == "Uploader" && (
              <Button color="inherit" variant="outlined" onClick={goWhere}>
                {navigationBtn}
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
};

export default Navbar;
