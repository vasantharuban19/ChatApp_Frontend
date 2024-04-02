import React from "react";
import { Box, Typography } from "@mui/material";
import { grayColor } from "../constants/color";
import Groups from "./Groups";

const groupsHome = ({user}) => {
  return (
    <Box bgcolor={grayColor} height={"100%"}>
       <Typography p={"2rem"} variant="h5" textAlign={"center"} >
       Select a friend to start messaging
      </Typography>
     
    </Box>
  );
};

export default Groups()(groupsHome);
