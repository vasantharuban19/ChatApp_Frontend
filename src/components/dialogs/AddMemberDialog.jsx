import {
  Dialog,
  Stack,
  DialogTitle,
  Button,
  Typography,
  Skeleton,
} from "@mui/material";
import React, { useState } from "react";
import UserItem from "../shared/UserItem";

import {
  useAddGroupMembersMutation,
  useAvailableFriendsQuery,
} from "../../redux/api/api";

import { useAsyncMutation, useErrors } from "../../hooks/hooks";

import { useDispatch, useSelector } from "react-redux";
import { setIsAddMember } from "../../redux/reducers/misc";

const AddMemberDialog = ({ chatId }) => {
  const dispatch = useDispatch();

  const { isAddMember } = useSelector((state) => state.misc);

  const { isLoading, data, isError, error } = useAvailableFriendsQuery(chatId);

  const [addMembers, isLoadingAddMembers] = useAsyncMutation(
    useAddGroupMembersMutation,
  );

  const [selectedMembers, setSelectedMembers] = useState([]);

  // Add / Remove member from selection
  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currentElement) => currentElement !== id)
        : [...prev, id],
    );
  };

  const addMemberSubmitHandler = async () => {
    if (selectedMembers.length === 0) {
      return;
    }

    const result = await addMembers("Adding Members...", {
      members: selectedMembers,
      chatId,
    });

    if (result?.success) {
      closeHandler();
    }
  };

  const closeHandler = () => {
    setSelectedMembers([]);
    dispatch(setIsAddMember(false));
  };

  useErrors([{ isError, error }]);

  return (
    <Dialog open={isAddMember} onClose={closeHandler}>
      <Stack
        p={{ xs: "1rem", sm: "2rem" }}
        width={{ xs: "90vw", sm: "20rem" }}
        maxWidth="25rem"
        spacing={"2rem"}
      >
        <DialogTitle textAlign={"center"}>Add Member</DialogTitle>

        <Stack
          spacing={"0.5rem"}
          maxHeight="50vh"
          overflow="auto"
          sx={{
            overflowX: "hidden",
          }}
        >
          {isLoading ? (
            <>
              <Skeleton variant="rounded" height={55} />
              <Skeleton variant="rounded" height={55} />
              <Skeleton variant="rounded" height={55} />
            </>
          ) : data?.friends?.length > 0 ? (
            data.friends.map((user) => (
              <UserItem
                user={user}
                key={user._id}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(user._id)}
                actionType="member"
              />
            ))
          ) : (
            <Typography textAlign={"center"}>No Friends</Typography>
          )}
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-evenly"
        >
          <Button
            variant="text"
            color="error"
            onClick={closeHandler}
            disabled={isLoadingAddMembers}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="success"
            onClick={addMemberSubmitHandler}
            disabled={isLoadingAddMembers || selectedMembers.length === 0}
          >
            {isLoadingAddMembers ? "Adding..." : "Add Members"}
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default AddMemberDialog;
