import { ErrorTwoTone as ErrorTwoToneIcon } from "@mui/icons-material";
import { Button, Container, Stack, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Container maxWidth="lg" sx={{ height: "100vh" }}>
      <Stack
        alignItems={"center"}
        spacing={"2rem"}
        justifyContent={"center"}
        height={"100%"}
      >
        <ErrorTwoToneIcon sx={{ fontSize: "10rem" }} />
        <Typography variant="h1">404</Typography>
        <Typography variant="h3">Page Not Found</Typography>
        <Button>
        <Link to="/">Go back to home</Link>
        </Button>
      </Stack>
    </Container>
  );
};

export default NotFound;
