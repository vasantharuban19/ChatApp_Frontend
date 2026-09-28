import { useInputValidation } from "6pp";
import { Search as SearchIcon } from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  InputAdornment,
  List,
  Stack,
  TextField,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation } from "../../hooks/hooks";
import {
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
} from "../../redux/api/api";
import { setIsSearch } from "../../redux/reducers/misc";
import UserItem from "../shared/UserItem";

const Search = () => {
  const dispatch = useDispatch();

  const search = useInputValidation("");

  const { isSearch } = useSelector((state) => state.misc);
  const loggedInUser = useSelector((state) => state.auth.user);

  const [searchUser, { isFetching }] = useLazySearchUserQuery();

  const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(
    useSendFriendRequestMutation,
  );

  const [users, setUsers] = useState([]);

  const [sentRequests, setSentRequests] = useState([]);

  // Send friend request
  const addFriendHandler = async (id) => {
    const result = await sendFriendRequest("Sending friend request...", {
      userId: id,
    });

    if (result?.success) {
      setSentRequests((prev) => {
        if (prev.includes(id)) return prev;
        return [...prev, id];
      });
    }
  };

  // Close search
  const searchCloseHandler = () => {
    dispatch(setIsSearch(false));

    search.changeHandler({
      target: {
        value: "",
      },
    });

    setUsers([]);

    setSentRequests([]);
  };

  // Load ALL users when search dialog opens
  useEffect(() => {
    if (!isSearch) return;

    const getUsers = async () => {
      try {
        const { data } = await searchUser("");

        if (data?.users) {
          const filteredUsers = data.users.filter(
            (user) => user._id !== loggedInUser?._id,
          );

          setUsers(filteredUsers);
        }
      } catch (error) {
        console.error("Failed to load users:", error);
        setUsers([]);
      }
    };

    getUsers();
  }, [isSearch, loggedInUser?._id, searchUser]);

  // Search users
  useEffect(() => {
    if (!isSearch) return;

    const searchValue = search.value.trim();

    // If empty, reload/show all users
    if (!searchValue) {
      const getAllUsers = async () => {
        try {
          const { data } = await searchUser("");

          if (data?.users) {
            const filteredUsers = data.users.filter(
              (user) => user._id !== loggedInUser?._id,
            );

            setUsers(filteredUsers);
          }
        } catch (error) {
          console.error("Failed to load users:", error);
        }
      };

      getAllUsers();
      return;
    }

    // Search after user stops typing
    const timeout = setTimeout(async () => {
      try {
        const { data } = await searchUser(searchValue);

        if (data?.users) {
          const filteredUsers = data.users.filter(
            (user) => user._id !== loggedInUser?._id,
          );

          setUsers(filteredUsers);
        }
      } catch (error) {
        console.error("Search error:", error);
        setUsers([]);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [search.value, isSearch, loggedInUser?._id, searchUser]);

  return (
    <Dialog
      open={isSearch}
      onClose={searchCloseHandler}
      fullWidth
      maxWidth="xs"
    >
      <Stack
        sx={{
          p: {
            xs: "1rem",
            sm: "1.5rem",
            md: "2rem",
          },
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: 600,
            pt: 0,
          }}
        >
          Find People
        </DialogTitle>

        {/* Search input */}
        <TextField
          autoFocus
          fullWidth
          label="Search people"
          placeholder="Enter username..."
          value={search.value}
          onChange={search.changeHandler}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),

            endAdornment: isFetching ? (
              <InputAdornment position="end">
                <CircularProgress size={18} />
              </InputAdornment>
            ) : null,
          }}
        />

        {/* User list */}
        <List
          sx={{
            mt: 1,
            width: "100%",
            maxHeight: {
              xs: "60vh",
              sm: "400px",
            },
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {isFetching && users.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                p: 2,
              }}
            >
              <CircularProgress size={25} />
            </Box>
          ) : users.length > 0 ? (
            users.map((user) => (
              <UserItem
                key={user._id}
                user={user}
                handler={addFriendHandler}
                handlerIsLoading={isLoadingSendFriendRequest}
                isAdded={sentRequests.includes(user._id)}
              />
            ))
          ) : (
            <Typography textAlign="center" color="text.secondary" sx={{ p: 2 }}>
              No users found
            </Typography>
          )}
        </List>
      </Stack>
    </Dialog>
  );
};

export default Search;
