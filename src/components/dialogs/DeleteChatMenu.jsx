import { Menu, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { setIsDeleteMenu } from "../../redux/reducers/misc";
import {
  Delete as DeleteIcon,
  ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAsyncMutation } from "../../hooks/hooks";
import {
  useDeleteChatMutation,
  useLeaveGroupMutation,
} from "../../redux/api/api";

const DeleteChatMenu = ({ dispatch, deleteMenuAnchor }) => {
  const navigate = useNavigate();

  const { isDeleteMenu, selectedDeleteChat } = useSelector(
    (state) => state.misc,
  );

  const [deleteChat, , deleteChatData] = useAsyncMutation(
    useDeleteChatMutation,
  );

  const [leaveGroup, , leaveGroupData] = useAsyncMutation(
    useLeaveGroupMutation,
  );

  const isGroup = selectedDeleteChat?.groupChat;

  const closeHandler = () => {
    dispatch(setIsDeleteMenu(false));
    deleteMenuAnchor.current = null;
  };

  // Unfriend
  const unfriendHandler = () => {
    closeHandler();

    deleteChat("Unfriending...", selectedDeleteChat.chatId);
  };

  // Leave group
  const leaveGroupHandler = () => {
    closeHandler();

    leaveGroup("Leaving group...", selectedDeleteChat.chatId);
  };

  // Navigate after successful action
  useEffect(() => {
    if (deleteChatData || leaveGroupData) {
      navigate("/");
    }
  }, [deleteChatData, leaveGroupData, navigate]);

  return (
    <Menu
      open={isDeleteMenu}
      onClose={closeHandler}
      anchorEl={deleteMenuAnchor.current}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "center",
        horizontal: "center",
      }}
    >
      <Stack
        sx={{
          width: "11rem",
          padding: "0.7rem",
          cursor: "pointer",

          "&:hover": {
            backgroundColor: "rgba(0,0,0,0.05)",
          },
        }}
        direction="row"
        alignItems="center"
        spacing="0.7rem"
        onClick={isGroup ? leaveGroupHandler : unfriendHandler}
      >
        {isGroup ? (
          <>
            <ExitToAppIcon color="warning" />
            <Typography>Leave Group</Typography>
          </>
        ) : (
          <>
            <DeleteIcon color="error" />
            <Typography>Unfriend</Typography>
          </>
        )}
      </Stack>
    </Menu>
  );
};

export default DeleteChatMenu;
