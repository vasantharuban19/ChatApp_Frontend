import { Box, Typography } from "@mui/material";
import React, { memo } from "react";
import moment from "moment";
import { green, lightBlue } from "../../constants/color";
import { fileFormat } from "../../lib/features";
import RenderComponent from "./RenderComponent";
import { motion } from "framer-motion";

const MsgComponent = ({ message, user }) => {
  const {
    sender,
    content,
    attachments = [],
    createdAt,
    deliveredTo = [],
    readBy = [],
  } = message;

  const sameSender = sender?._id?.toString() === user?._id?.toString();

  const messageTime = moment(createdAt).format("DD MMM YYYY, h:mm A");

  // Delivery/read status
  // Message status
  const currentUserId = user?._id?.toString();

  const isDelivered = deliveredTo.some(
    (id) => id?.toString() !== currentUserId,
  );

  const isRead = readBy.some((id) => id?.toString() !== currentUserId);
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: sameSender ? 20 : -20,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        duration: 0.2,
      }}
      style={{
        alignSelf: sameSender ? "flex-end" : "flex-start",
        backgroundColor: sameSender ? green : "white",
        color: sameSender ? "white" : "black",
        borderRadius: sameSender
          ? "1rem 1rem 0.25rem 1rem"
          : "1rem 1rem 1rem 0.25rem",
        padding: "0.6rem 0.75rem",
        width: "fit-content",
        maxWidth: "65%",
        minWidth: "4rem",
        overflowWrap: "anywhere",
        wordBreak: "break-word",
        boxShadow: "0 1px 2px rgba(0,0,0,0.12)",
        position: "relative",
      }}
    >
      {/* Sender name */}
      {!sameSender && (
        <Typography
          color={lightBlue}
          fontWeight={600}
          variant="caption"
          sx={{
            display: "block",
            marginBottom: "0.2rem",
          }}
        >
          {sender?.name}
        </Typography>
      )}

      {/* Message text */}
      {content && (
        <Typography
          sx={{
            whiteSpace: "pre-wrap",
            overflowWrap: "anywhere",
            lineHeight: 1.45,
          }}
        >
          {content}
        </Typography>
      )}

      {/* Attachments */}
      {attachments.length > 0 &&
        attachments.map((attachment, index) => {
          const url = attachment.url;
          const file = fileFormat(url);

          return (
            <Box
              key={attachment._id || url || index}
              sx={{
                marginTop: content ? "0.4rem" : 0,
                maxWidth: "100%",
                overflow: "hidden",
              }}
            >
              {file === "image" ? (
                <RenderComponent file={file} url={url} />
              ) : (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  style={{
                    color: sameSender ? "white" : "black",
                    textDecoration: "none",
                  }}
                >
                  <RenderComponent file={file} url={url} />
                </a>
              )}
            </Box>
          );
        })}

      {/* Timestamp + Message Status */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "0.25rem",
          marginTop: "0.25rem",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontSize: "0.65rem",
            color: sameSender ? "rgba(255,255,255,0.75)" : "text.secondary",
          }}
        >
          {messageTime}
        </Typography>

        {/* Only show status for messages sent by current user */}
        {sameSender && (
          <Typography
            component="span"
            sx={{
              fontSize: "0.75rem",
              fontWeight: 700,
              lineHeight: 1,
              color: isRead ? "#34B7F1" : "rgba(255,255,255,0.8)",
            }}
          >
            {isRead ? "✓✓" : isDelivered ? "✓✓" : "✓"}
          </Typography>
        )}
      </Box>
    </motion.div>
  );
};

export default memo(MsgComponent);
