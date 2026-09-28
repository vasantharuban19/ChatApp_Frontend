import React from "react";
import { Stack, Typography } from "@mui/material";
import ChatItem from "../shared/ChatItem";
import { grayColor } from "../../constants/color";

const ChatList = ({
  w = "100%",
  chats = [],
  chatId,
  onlineUsers = [],
  newMessagesAlert = [
    {
      chatId: "",
      count: 0,
    },
  ],
  handleDeleteChat,
}) => {
  return (
    <Stack
      width={w}
      direction={"column"}
      height={"100%"}
      sx={{
        overflowY: "auto",
        overflowX: "hidden",
        bgcolor: grayColor,
        scrollbarWidth: "thin",
      }}
    >
      {chats?.length > 0 ? (
        chats.map((data, index) => {
          const { avatar, name, _id, groupChat, members } = data;

          const newMessageAlert = newMessagesAlert.find(
            ({ chatId }) => chatId === _id,
          );

          const isOnline = members?.some((member) =>
            onlineUsers.includes(member),
          );

          return (
            <ChatItem
              index={index}
              newMessageAlert={newMessageAlert}
              isOnline={isOnline}
              avatar={avatar}
              name={name}
              _id={_id}
              key={_id}
              groupChat={groupChat}
              sameSender={chatId === _id}
              handleDeleteChat={handleDeleteChat}
            />
          );
        })
      ) : (
        <Stack
          alignItems={"center"}
          justifyContent={"center"}
          height={"100%"}
          px={2}
        >
          <Typography
            textAlign={"center"}
            color={"text.secondary"}
            fontWeight={500}
          >
            No conversations yet
          </Typography>

          <Typography
            variant={"body2"}
            textAlign={"center"}
            color={"text.secondary"}
            mt={0.5}
          >
            Add a New Friend to begin messaging.
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};

export default ChatList;
