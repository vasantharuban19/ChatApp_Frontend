import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  Stack,
  Typography,
  Button,
  TextField,
  Skeleton,
  Box,
} from "@mui/material";
import UserItem from "../shared/UserItem";
import { useInputValidation } from "6pp";
import { useDispatch, useSelector } from "react-redux";
import {
  useAvailableFriendsQuery,
  useNewGroupMutation,
} from "../../redux/api/api";
import { useAsyncMutation, useErrors } from "../../hooks/hooks";
import { setIsNewGroup } from "../../redux/reducers/misc";
import toast from "react-hot-toast";

const NewGroup = () => {
  const { isNewGroup } = useSelector((state) => state.misc);

  const dispatch = useDispatch();

  const { isError, isLoading, error, data } = useAvailableFriendsQuery();

  const [newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation);

  const groupName = useInputValidation("");

  const [selectedMembers, setSelectedMembers] = useState([]);

  const errors = [
    {
      isError,
      error,
    },
  ];

  useErrors(errors);

  //  Select / unselect member
  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currentElement) => currentElement !== id)
        : [...prev, id],
    );
  };

  //  Create group
  const submitHandler = async () => {
    const trimmedGroupName = groupName.value.trim();

    if (!trimmedGroupName) {
      return toast.error("Group name is required");
    }

    if (selectedMembers.length < 2) {
      return toast.error("Please select at least 2 friends");
    }

    const result = await newGroup("Creating new group...", {
      name: trimmedGroupName,
      members: selectedMembers,
    });

    // Only close if creation succeeded
    if (result?.success) {
      resetForm();
      dispatch(setIsNewGroup(false));
    }
  };

  //  Reset form
  const resetForm = () => {
    setSelectedMembers([]);

    groupName.changeHandler({
      target: {
        value: "",
      },
    });
  };

  const closeHandler = () => {
    if (isLoadingNewGroup) return;

    resetForm();
    dispatch(setIsNewGroup(false));
  };

  return (
    <Dialog
      open={isNewGroup}
      onClose={closeHandler}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: {
            xs: 0,
            sm: "1rem",
          },
          width: "100%",
          maxHeight: "90vh",
        },
      }}
    >
      <Stack
        sx={{
          p: {
            xs: "1rem",
            sm: "1.5rem",
            md: "2rem",
          },
          gap: {
            xs: "1rem",
            sm: "1.5rem",
          },
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: 600,
            p: 0,
          }}
        >
          Create New Group
        </DialogTitle>

        {/* Group name */}
        <TextField
          fullWidth
          label="Group Name"
          placeholder="Enter group name"
          value={groupName.value}
          onChange={groupName.changeHandler}
          disabled={isLoadingNewGroup}
          autoFocus
        />

        {/* Members header */}
        <Box>
          <Typography variant="body1" color="primary" fontWeight={600}>
            Select Members
          </Typography>

          <Typography variant="caption" color="text.secondary">
            {selectedMembers.length} selected
            {selectedMembers.length < 2 && " • Select at least 2"}
          </Typography>
        </Box>

        {/* Friends list */}
        <Stack
          sx={{
            maxHeight: {
              xs: "40vh",
              sm: "350px",
            },
            overflowY: "auto",
            overflowX: "hidden",
            pr: 0.5,

            "&::-webkit-scrollbar": {
              width: "5px",
            },

            "&::-webkit-scrollbar-thumb": {
              borderRadius: "10px",
              backgroundColor: "rgba(0,0,0,0.25)",
            },
          }}
        >
          {isLoading ? (
            <>
              <Skeleton height={60} />
              <Skeleton height={60} />
              <Skeleton height={60} />
            </>
          ) : data?.friends?.length > 0 ? (
            data.friends.map((i) => (
              <UserItem
                user={i}
                key={i._id}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(i._id)}
                actionType="select"
              />
            ))
          ) : (
            <Typography
              textAlign="center"
              color="text.secondary"
              sx={{ py: 3 }}
            >
              No friends available
            </Typography>
          )}
        </Stack>

        {/* Actions */}
        <Stack direction="row" justifyContent="flex-end" spacing={1}>
          <Button
            color="error"
            size="large"
            onClick={closeHandler}
            disabled={isLoadingNewGroup}
          >
            Cancel
          </Button>

          <Button
            size="large"
            onClick={submitHandler}
            disabled={
              isLoadingNewGroup ||
              selectedMembers.length < 2 ||
              !groupName.value.trim()
            }
          >
            {isLoadingNewGroup ? "Creating..." : "Create"}
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default NewGroup;
