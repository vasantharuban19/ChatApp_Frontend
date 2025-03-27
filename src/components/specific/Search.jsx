import { useInputValidation } from "6pp";
import { Search as SearchIcon } from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  InputAdornment,
  List,
  Stack,
  TextField,
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

  const [searchUser] = useLazySearchUserQuery();
  const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(
    useSendFriendRequestMutation
  );

  const [users, setUsers] = useState([]);
  // console.log(users);

  const addFriendHandler = async (id) => {
    sendFriendRequest("Sending friend request", { userId: id });
  };

  const searchCloseHandler = () => {
    dispatch(setIsSearch(false));
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      searchUser(search.value)
        .then(({ data }) => {
          if (data?.users) {
            const filteredUsers = data.users.filter(
              (user) => user._id !== loggedInUser?._id
            );
            setUsers(filteredUsers);
          }
        })
        .catch((e) => console.log(e));
    }, 1000);
    return () => clearTimeout(timeout);
  }, [search.value]);

  return (
    <Dialog open={isSearch} onClose={searchCloseHandler}>
      <Stack p={"2rem"} direction={"column"} width={"20rem"}>
        <DialogTitle textAlign={"center"}>Find People</DialogTitle>
        <TextField
          label=""
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
          }}
        />
        <List>
          {users.map((i) => (
            <UserItem
              key={i._id}
              user={i}
              handler={addFriendHandler}
              handlerIsLoading={isLoadingSendFriendRequest}
            />
          ))}
        </List>
      </Stack>
    </Dialog>
  );
};

export default Search;
