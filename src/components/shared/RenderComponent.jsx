import React, { useState } from "react";
import { Box, Dialog, IconButton, Typography } from "@mui/material";
import {
  Close as CloseIcon,
  FileOpen as FileOpenIcon,
} from "@mui/icons-material";
import { transformImage } from "../../lib/features";

const RenderComponent = ({ file, url }) => {
  const [openPreview, setOpenPreview] = useState(false);

  const handleOpenPreview = () => {
    if (file === "image") {
      setOpenPreview(true);
    }
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
  };

  switch (file) {
    case "video":
      return (
        <Box
          component="video"
          src={url}
          preload="metadata"
          controls
          sx={{
            display: "block",
            width: "100%",
            maxWidth: {
              xs: "260px",
              sm: "320px",
            },
            height: "auto",
            maxHeight: "250px",
            borderRadius: "0.75rem",
            objectFit: "contain",
          }}
        />
      );

    case "image":
      return (
        <>
          {/* Chat Image */}
          <Box
            component="img"
            src={transformImage(url, 400)}
            alt="Attachment"
            loading="lazy"
            onClick={handleOpenPreview}
            sx={{
              display: "block",
              width: "100%",
              maxWidth: {
                xs: "260px",
                sm: "320px",
              },
              height: "auto",
              maxHeight: "300px",
              objectFit: "contain",
              borderRadius: "0.75rem",
              cursor: "pointer",

              transition: "transform 0.2s ease",

              "&:hover": {
                transform: "scale(1.02)",
              },
            }}
          />

          {/* Full Screen Preview */}
          <Dialog
            open={openPreview}
            onClose={handleClosePreview}
            fullScreen
            PaperProps={{
              sx: {
                backgroundColor: "rgba(0, 0, 0, 0.95)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
            }}
          >
            {/* Close Button */}
            <IconButton
              onClick={handleClosePreview}
              aria-label="Close image preview"
              sx={{
                position: "fixed",
                top: "1rem",
                right: "1rem",
                zIndex: 10,
                color: "white",
                backgroundColor: "rgba(255,255,255,0.15)",

                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.25)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* Full Image */}
            <Box
              component="img"
              src={url}
              alt="Full screen attachment"
              sx={{
                maxWidth: "95vw",
                maxHeight: "90vh",
                objectFit: "contain",
                userSelect: "none",
              }}
            />
          </Dialog>
        </>
      );

    case "audio":
      return (
        <Box
          component="audio"
          src={url}
          preload="metadata"
          controls
          sx={{
            display: "block",
            width: {
              xs: "220px",
              sm: "280px",
            },
            maxWidth: "100%",
          }}
        />
      );

    default:
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem",
          }}
        >
          <FileOpenIcon fontSize="small" />

          <Typography variant="body2">Open attachment</Typography>
        </Box>
      );
  }
};

export default RenderComponent;
