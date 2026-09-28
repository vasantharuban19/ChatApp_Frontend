import React, { memo } from "react";
import { Link } from "../styles/StyledComponent";
import { Box, Stack, Typography } from "@mui/material";
import AvatarCard from "./AvatarCard";
import { motion } from "framer-motion";
import { green, darkGreen } from "../../constants/color";

const ChatItem = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  index = 0,
  handleDeleteChat,
}) => {
  return (
    <Link
      sx={{
        padding: 0,
        display: "block",
        width: "100%",
      }}
      to={`/chat/${_id}`}
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.2,
          delay: Math.min(index * 0.05, 0.3),
        }}
        style={{
          display: "flex",
          gap: "0.75rem",
          alignItems: "center",
          padding: "0.75rem 1rem", // ⭐ CHANGED
          backgroundColor: sameSender ? darkGreen : "transparent",
          color: sameSender ? "white" : "inherit",
          position: "relative",
          width: "100%", //
          boxSizing: "border-box",
          minWidth: 0,
          cursor: "pointer",
        }}
        whileHover={{
          backgroundColor: sameSender ? darkGreen : "rgba(0, 0, 0, 0.05)",
        }}
      >
        <AvatarCard avatar={avatar} />

        <Stack
          spacing={0.25}
          sx={{
            flex: 1,
            minWidth: 0,
            paddingRight: "1.5rem",
          }}
        >
          <Typography
            noWrap
            sx={{
              fontWeight: sameSender ? 600 : 500,
              fontSize: {
                xs: "0.9rem",
                sm: "0.95rem",
              },
            }}
          >
            {name}
          </Typography>

          {newMessageAlert && (
            <Typography
              variant="caption"
              sx={{
                color: sameSender ? "rgba(255,255,255,0.8)" : "text.secondary",
                fontWeight: 500,
              }}
            >
              {newMessageAlert.count}{" "}
              {newMessageAlert.count === 1 ? "New Message" : "New Messages"}
            </Typography>
          )}
        </Stack>

        {isOnline && (
          <Box
            sx={{
              width: "9px",
              height: "9px",
              minWidth: "9px",
              borderRadius: "50%",
              backgroundColor: green,
              position: "absolute",
              top: "50%",
              right: "0.75rem",
              transform: "translateY(-50%)",
              border: "2px solid white",
              boxSizing: "content-box",
            }}
          />
        )}
      </motion.div>
    </Link>
  );
};

export default memo(ChatItem);
