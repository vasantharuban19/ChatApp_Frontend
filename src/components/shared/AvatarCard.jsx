import { Avatar, Box } from "@mui/material";
import React from "react";
import { transformImage } from "../../lib/features";

const AvatarCard = ({ avatar = [], max = 4 }) => {
  const visibleAvatars = avatar.slice(0, max);

  const remainingCount = avatar.length - max;

  return (
    <Box
      sx={{
        position: "relative",
        width: {
          xs: "3.5rem",
          sm: "4rem",
        },
        height: {
          xs: "3rem",
          sm: "3.25rem",
        },
        flexShrink: 0,
      }}
    >
      {visibleAvatars.map((image, index) => (
        <Avatar
          key={image?._id || image || index}
          src={transformImage(image)}
          alt={`Avatar ${index + 1}`}
          sx={{
            width: {
              xs: "2.5rem",
              sm: "2.75rem",
            },
            height: {
              xs: "2.5rem",
              sm: "2.75rem",
            },
            position: "absolute",

            left: {
              xs: `${index * 0.7}rem`,
              sm: `${index * 0.8}rem`,
            },

            top: "50%",
            transform: "translateY(-50%)",

            border: "2px solid white",

            zIndex: visibleAvatars.length - index,
          }}
        />
      ))}

      {remainingCount > 0 && (
        <Avatar
          sx={{
            width: {
              xs: "2.5rem",
              sm: "2.75rem",
            },
            height: {
              xs: "2.5rem",
              sm: "2.75rem",
            },
            position: "absolute",
            left: {
              xs: `${Math.min(max, 3) * 0.7}rem`,
              sm: `${Math.min(max, 3) * 0.8}rem`,
            },
            top: "50%",
            transform: "translateY(-50%)",
            border: "2px solid white",
            bgcolor: "grey.500",
            fontSize: "0.75rem",
            fontWeight: 600,
            zIndex: 0,
          }}
        >
          +{remainingCount}
        </Avatar>
      )}
    </Box>
  );
};

export default AvatarCard;
