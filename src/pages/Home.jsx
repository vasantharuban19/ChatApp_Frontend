import React from "react";
import AppLayout from "../components/layout/AppLayout";
import { Box, Stack, Typography } from "@mui/material";
import { grayColor } from "../constants/color";

const Home = ({ user }) => {
  return (
    <Box
      bgcolor={grayColor}
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Stack
        spacing={2}
        alignItems="center"
        textAlign="center"
        sx={{
          px: 2,
        }}
      >
        <Typography variant="h5" fontWeight={600}>
          Welcome 👋 {user?.name} ❄
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Select a friend to start messaging
        </Typography>
      </Stack>
    </Box>
  );
};

export default AppLayout()(Home);
