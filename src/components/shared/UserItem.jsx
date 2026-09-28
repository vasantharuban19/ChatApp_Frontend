import {
  IconButton,
  ListItem,
  Stack,
  Typography,
  Avatar,
  Tooltip,
} from "@mui/material";
import React, { memo } from "react";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import { transformImage } from "../../lib/features";

const UserItem = ({
  user,
  handler,
  handlerIsLoading = false,
  isAdded = false,
  styling = {},
  actionType = "friend",
}) => {
  const { name, _id, avatar } = user;

  const isMemberMode = actionType === "member" || actionType === "select";

  const isFriendRequestSent = actionType === "friend" && isAdded;

  const handleClick = () => {
    if (!handler || !_id || handlerIsLoading || isFriendRequestSent) {
      return;
    }

    handler(_id);
  };

  const tooltipTitle = isFriendRequestSent
    ? "Friend request sent"
    : isMemberMode
      ? isAdded
        ? "Remove"
        : "Add"
      : "Send friend request";

  return (
    <ListItem
      disableGutters
      sx={{
        width: "100%",
        ...styling,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        width="100%"
        minWidth={0}
      >
        <Avatar
          src={transformImage(avatar)}
          alt={name}
          sx={{
            flexShrink: 0,
          }}
        />

        <Typography
          variant="body1"
          sx={{
            flex: 1,
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {name}
        </Typography>

        <Tooltip title={tooltipTitle}>
          <span>
            <IconButton
              size="small"
              onClick={handleClick}
              disabled={handlerIsLoading || isFriendRequestSent}
              sx={{
                flexShrink: 0,

                bgcolor: isFriendRequestSent
                  ? "success.main"
                  : isAdded
                    ? "error.main"
                    : "primary.main",

                color: "white",

                "&:hover": {
                  bgcolor: isFriendRequestSent
                    ? "success.dark"
                    : isAdded
                      ? "error.dark"
                      : "primary.dark",
                },
              }}
            >
              {isFriendRequestSent ? (
                <CheckIcon />
              ) : isAdded ? (
                <RemoveIcon />
              ) : (
                <AddIcon />
              )}
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
    </ListItem>
  );
};

export default memo(UserItem);
