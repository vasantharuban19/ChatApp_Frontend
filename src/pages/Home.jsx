import React from "react";
import AppLayout from "../components/layout/AppLayout";
import { Box, Typography } from "@mui/material";
import { grayColor } from "../constants/color";

const Home = ({user}) => {
  return (
    <Box bgcolor={grayColor} height={"100%"}>
       <Typography p={"2rem"} variant="h5" textAlign={"center"} justifyContent={'center'}>
        Welcome 👋 {user?.name} ❄
        <br/><br/>
        <p>Select a friend to start messaging</p>
      </Typography>
     
    </Box>
  );
};

export default AppLayout()(Home);
