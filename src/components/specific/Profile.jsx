import React from "react";
import moment from "moment";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import {
  AlternateEmail as Username,
  PermIdentity as Name,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import { transformImage } from "../../lib/features";

const Profile = ({ user }) => {
  return (
    <Stack
      spacing={{
        xs: "1.5rem",
        sm: "2rem",
      }}
      direction="column"
      alignItems="center"
      sx={{
        width: "100%",
        maxWidth: "320px",
        margin: "0 auto",
      }}
    >
      {/* Profile Avatar */}
      <Avatar
        src={transformImage(user?.avatar?.url)}
        alt={user?.name || "User"}
        sx={{
          width: {
            xs: 130,
            sm: 160,
            md: 180,
            lg: 200,
          },
          height: {
            xs: 130,
            sm: 160,
            md: 180,
            lg: 200,
          },
          objectFit: "cover",
          marginBottom: "0.5rem",
          border: "5px solid white",
          boxShadow: "0 4px 15px rgba(0,0,0,0.25)",
        }}
      />

      {/* Bio */}
      <ProfileCard heading="Bio" text={user?.bio || "No bio available"} />

      {/* Name */}
      <ProfileCard
        heading="Name"
        text={user?.name || "Unknown"}
        Icon={<Name />}
      />

      {/* Username */}
      <ProfileCard
        heading="Username"
        text={user?.username ? `@${user.username}` : "Unknown"}
        Icon={<Username />}
      />

      {/* Joined date */}
      <ProfileCard
        heading="Joined"
        text={
          user?.createdAt
            ? moment(user.createdAt).format("DD MMM YYYY")
            : "Unknown"
        }
        Icon={<CalendarIcon />}
      />
    </Stack>
  );
};

const ProfileCard = ({ text, Icon, heading }) => (
  <Stack
    direction="row"
    alignItems="center"
    spacing="1rem"
    color="white"
    sx={{
      width: "100%",
      maxWidth: "280px",
    }}
  >
    {/* Icon */}
    {Icon && (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: "2.5rem",
        }}
      >
        {Icon}
      </Box>
    )}

    {/* Content */}
    <Stack
      sx={{
        minWidth: 0,
        flex: 1,
      }}
    >
      <Typography
        variant="body1"
        sx={{
          fontWeight: 500,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </Typography>

      <Typography
        color="gray"
        variant="caption"
        sx={{
          fontSize: "0.75rem",
        }}
      >
        {heading}
      </Typography>
    </Stack>
  </Stack>
);

export default Profile;
