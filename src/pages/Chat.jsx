import { useInfiniteScrollTop } from "6pp";
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from "@mui/icons-material";
import { Fab, IconButton, Skeleton, Stack, Tooltip } from "@mui/material";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import FileMenu from "../components/dialogs/FileMenu";
import AppLayout from "../components/layout/AppLayout";
import { TypingLoader } from "../components/layout/Loaders";
import MsgComponent from "../components/shared/MsgComponent";
import { InputBox } from "../components/styles/StyledComponent";

import { darkGreen, grayColor, green } from "../constants/color";

import {
  ALERT,
  NEW_MESSAGE,
  START_TYPING,
  STOP_TYPING,
  USER_OFFLINE,
  USER_ONLINE,
  MESSAGE_DELIVERED,
  MESSAGE_READ,
} from "../constants/events";

import { useErrors, useSocketEvents } from "../hooks/hooks";

import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api";

import { removeNewMessagesAlert } from "../redux/reducers/chat";
import { setIsFileMenu } from "../redux/reducers/misc";
import { getSocket } from "../socket";

const Chat = ({ chatId, user }) => {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);

  const socket = getSocket();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // -----------------------------
  // State
  // -----------------------------

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);

  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);

  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const [showNewMessages, setShowNewMessages] = useState(false);
  // -----------------------------
  // Refs
  // -----------------------------

  const typingTimeoutRef = useRef(null);
  const isNearBottomRef = useRef(true);

  // Used to preserve scroll position
  // when loading previous messages
  const previousScrollHeight = useRef(0);
  const previousScrollTop = useRef(0);
  const previousMessagesLength = useRef(0);

  // -----------------------------
  // Chat details
  // -----------------------------

  const chatDetails = useChatDetailsQuery({
    chatId,
    skip: !chatId,
  });

  // -----------------------------
  // Messages
  // -----------------------------

  const oldMessagesChunk = useGetMessagesQuery({
    chatId,
    page,
  });

  const { data: oldMessages = [], setData: setOldMessages } =
    useInfiniteScrollTop(
      containerRef,
      oldMessagesChunk.data?.totalPages,
      page,
      setPage,
      oldMessagesChunk.data?.messages,
    );

  // -----------------------------
  // Errors
  // -----------------------------

  useErrors([
    {
      isError: chatDetails.isError,
      error: chatDetails.error,
    },
    {
      isError: oldMessagesChunk.isError,
      error: oldMessagesChunk.error,
    },
  ]);

  const members = chatDetails?.data?.chat?.members;

  // =====================================================
  // TYPING
  // =====================================================

  const stopTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    if (IamTyping && chatId && members?.length) {
      socket.emit(STOP_TYPING, {
        members,
        chatId,
      });
    }

    setIamTyping(false);
  }, [IamTyping, chatId, members, socket]);

  const messageOnChangeHandler = (e) => {
    const value = e.target.value;

    setMessage(value);

    if (!chatId || !members?.length) return;

    // Start typing
    if (!IamTyping) {
      socket.emit(START_TYPING, {
        members,
        chatId,
      });

      setIamTyping(true);
    }

    // Reset existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit(STOP_TYPING, {
        members,
        chatId,
      });

      setIamTyping(false);
      typingTimeoutRef.current = null;
    }, 2000);
  };

  // =====================================================
  // FILE
  // =====================================================

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };

  // =====================================================
  // SEND MESSAGE
  // =====================================================

  const submitHandler = (e) => {
    e.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    if (!chatId || !members?.length) return;

    socket.emit(NEW_MESSAGE, {
      chatId,
      members,
      message: trimmedMessage,
    });

    setMessage("");

    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    });

    stopTyping();
  };

  // =====================================================
  // ENTER TO SEND
  // SHIFT + ENTER = NEW LINE
  // =====================================================

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      submitHandler(e);
    }
  };

  // =====================================================
  // USER ONLINE / OFFLINE
  // =====================================================

  useEffect(() => {
    if (!chatId || !user?._id || !members?.length) {
      return;
    }

    socket.emit(USER_ONLINE, {
      userId: user._id,
      members,
    });

    dispatch(removeNewMessagesAlert(chatId));

    return () => {
      // Stop typing when changing chat
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }

      if (members?.length) {
        socket.emit(STOP_TYPING, {
          members,
          chatId,
        });

        socket.emit(USER_OFFLINE, {
          userId: user._id,
          members,
        });
      }

      setIamTyping(false);
      setUserTyping(false);
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
    };
  }, [chatId, user?._id, members, socket, dispatch, setOldMessages]);

  // =====================================================
  // CHAT ERROR
  // =====================================================

  useEffect(() => {
    if (chatDetails.isError) {
      navigate("/", { replace: true });
    }
  }, [chatDetails.isError, navigate]);

  // =====================================================
  // NEW MESSAGE
  // =====================================================

  const newMessageHandler = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      const newMessage = data.message;

      setMessages((prev) => {
        // Prevent duplicate messages
        if (prev.some((msg) => msg._id === newMessage._id)) {
          return prev;
        }

        return [...prev, newMessage];
      });

      // ✓ Delivered
      if (newMessage.sender?._id !== user?._id) {
        socket.emit(MESSAGE_DELIVERED, {
          messageId: newMessage._id,
          senderId: newMessage.sender._id,
          chatId,
        });

        if (!isNearBottomRef.current) {
          setShowNewMessages(true);
        }
      }
    },
    [chatId, user?._id, socket],
  );

  // ⭐ NEW: Message delivered listener
  // ⭐ FIXED: Message delivered listener
  const messageDeliveredHandler = useCallback(
    ({ messageId, userId, chatId: eventChatId }) => {
      if (eventChatId !== chatId) return;

      setMessages((prev) =>
        prev.map((message) => {
          if (message._id !== messageId) {
            return message;
          }

          const deliveredTo = message.deliveredTo || [];

          const alreadyDelivered = deliveredTo.some(
            (id) => id?.toString() === userId?.toString(),
          );

          if (alreadyDelivered) {
            return message;
          }

          return {
            ...message,
            deliveredTo: [...deliveredTo, userId],
          };
        }),
      );
    },
    [chatId],
  );

  // ⭐ NEW: Message read listener
  // ⭐ FIXED: Message read listener
  const messageReadHandler = useCallback(
    ({ messageId, userId, chatId: eventChatId }) => {
      if (eventChatId !== chatId) return;

      setMessages((prev) =>
        prev.map((message) => {
          if (message._id !== messageId) {
            return message;
          }

          const readBy = message.readBy || [];

          const alreadyRead = readBy.some(
            (id) => id?.toString() === userId?.toString(),
          );

          if (alreadyRead) {
            return message;
          }

          return {
            ...message,
            readBy: [...readBy, userId],
          };
        }),
      );
    },
    [chatId],
  );
  // =====================================================
  // USER START TYPING
  // =====================================================

  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setUserTyping(true);
    },
    [chatId],
  );

  // =====================================================
  // USER STOP TYPING
  // =====================================================

  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setUserTyping(false);
    },
    [chatId],
  );

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });

    setShowNewMessages(false);
  };
  // =====================================================
  // ALERT
  // =====================================================

  const alertListener = useCallback(
    ({ data }) => {
      if (data?.chatId !== chatId) return;

      const messageForAlert = {
        content: data?.message,
        sender: {
          _id: "admin",
          name: "Admin",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, messageForAlert]);
    },
    [chatId],
  );

  // =====================================================
  // SOCKET EVENTS
  // =====================================================

  const eventHandler = {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessageHandler,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
    [MESSAGE_DELIVERED]: messageDeliveredHandler,
    [MESSAGE_READ]: messageReadHandler,
  };

  useSocketEvents(socket, eventHandler);

  // =====================================================
  // PRESERVE SCROLL POSITION
  // =====================================================

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const handleScroll = () => {
      const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;

      const nearBottom = distanceFromBottom < 150;

      isNearBottomRef.current = nearBottom;

      setShowNewMessages(!nearBottom);
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useLayoutEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    if (!previousScrollHeight.current) return;

    const newScrollHeight = container.scrollHeight;

    const heightDifference = newScrollHeight - previousScrollHeight.current;

    container.scrollTop = previousScrollTop.current + heightDifference;

    previousScrollHeight.current = 0;
    previousScrollTop.current = 0;
  }, [oldMessages]);

  // =====================================================
  // AUTO SCROLL NEW MESSAGES
  // =====================================================

  useEffect(() => {
    if (!bottomRef.current) return;

    const currentLength = messages.length;

    // First render
    if (previousMessagesLength.current === 0) {
      previousMessagesLength.current = currentLength;
      return;
    }

    // Only scroll when a NEW message is added
    if (currentLength > previousMessagesLength.current) {
      if (isNearBottomRef.current) {
        bottomRef.current.scrollIntoView({
          behavior: "smooth",
        });
      }
    }

    previousMessagesLength.current = currentLength;
  }, [messages]);
  // =====================================================
  // CLEANUP TYPING TIMEOUT
  // =====================================================

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // =====================================================
  // ALL MESSAGES
  // =====================================================

  const allMessages = [...oldMessages, ...messages];

  useEffect(() => {
    if (!user?._id || !chatId || !allMessages.length) return;

    const timer = setTimeout(() => {
      allMessages.forEach((msg) => {
        if (!msg?._id || !msg?.sender?._id) return;

        // Don't mark our own messages as read
        if (msg.sender._id.toString() === user._id.toString()) {
          return;
        }

        socket.emit(MESSAGE_READ, {
          messageId: msg._id,
          senderId: msg.sender._id,
          chatId,
        });
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [allMessages, chatId, user?._id, socket]);

  // =====================================================
  // LOADING
  // =====================================================

  if (chatDetails.isLoading) {
    return <Skeleton />;
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <>
      {/* ================= Messages ================= */}

      <Stack
        ref={containerRef}
        boxSizing="border-box"
        padding={{
          xs: "0.5rem",
          sm: "0.75rem",
          md: "1rem",
        }}
        spacing={{
          xs: "0.5rem",
          sm: "0.75rem",
          md: "1rem",
        }}
        bgcolor={grayColor}
        height="calc(100% - 4.5rem)"
        sx={{
          overflowX: "hidden",
          overflowY: "auto",

          "&::-webkit-scrollbar": {
            width: "6px",
          },

          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,0.25)",
            borderRadius: "10px",
          },
        }}
      >
        {allMessages.map((message, index) => (
          <MsgComponent
            key={message._id || `message-${index}`}
            message={message}
            user={user}
          />
        ))}

        {userTyping && <TypingLoader />}

        <div ref={bottomRef} />
      </Stack>

      {showNewMessages && (
        <Fab
          size="small"
          onClick={scrollToBottom}
          sx={{
            position: "absolute",
            bottom: "5.5rem",
            right: {
              xs: "1rem",
              sm: "1.5rem",
              md: "2rem",
            },
            zIndex: 10,
            boxShadow: 3,
          }}
        >
          <KeyboardArrowDownIcon />
        </Fab>
      )}

      {/* ================= Message Input ================= */}

      <form
        onSubmit={submitHandler}
        style={{
          height: "4.5rem",
          width: "100%",
        }}
      >
        <Stack
          direction="row"
          height="100%"
          padding={{
            xs: "0.5rem",
            sm: "0.75rem",
            md: "1rem",
          }}
          alignItems="center"
          position="relative"
        >
          {/* Attachment */}

          <Tooltip title="Attach file">
            <IconButton
              type="button"
              onClick={handleFileOpen}
              sx={{
                position: "absolute",
                left: {
                  xs: "0.35rem",
                  sm: "0.75rem",
                  md: "1rem",
                },
                rotate: "30deg",
                zIndex: 1,
              }}
            >
              <AttachFileIcon />
            </IconButton>
          </Tooltip>

          {/* Input */}

          <InputBox
            placeholder="Type a message..."
            value={message}
            onChange={messageOnChangeHandler}
            onKeyDown={handleKeyDown}
          />

          {/* Send */}

          <Tooltip title="Send message">
            <IconButton
              type="submit"
              disabled={!message.trim()}
              sx={{
                rotate: "-30deg",

                bgcolor: green,
                color: "white",

                marginLeft: {
                  xs: "0.25rem",
                  sm: "0.5rem",
                  md: "1rem",
                },

                padding: {
                  xs: "0.4rem",
                  sm: "0.5rem",
                },

                "&:hover": {
                  bgcolor: darkGreen,
                },

                "&.Mui-disabled": {
                  bgcolor: "rgba(0,0,0,0.15)",
                  color: "rgba(0,0,0,0.4)",
                },
              }}
            >
              <SendIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </form>

      {/* ================= File Menu ================= */}

      <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} />
    </>
  );
};

const WrappedChat = AppLayout()(Chat);

export default WrappedChat;
