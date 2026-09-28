import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Done as DoneIcon,
  Edit as EditIcon,
  KeyboardBackspace as KeyboardBackspaceIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";

import {
  Backdrop,
  Button,
  CircularProgress,
  Drawer,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import React, { Suspense, lazy, memo, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

import { LayoutLoader } from "../components/layout/Loaders";
import AvatarCard from "../components/shared/AvatarCard";
import UserItem from "../components/shared/UserItem";
import { Link } from "../components/styles/StyledComponent";

import { bgGradient, matBlack } from "../constants/color";

import { useAsyncMutation, useErrors } from "../hooks/hooks";

import {
  useChatDetailsQuery,
  useDeleteChatMutation,
  useMyGroupsQuery,
  useRemoveGroupMemberMutation,
  useRenameGroupMutation,
} from "../redux/api/api";

import { setIsAddMember } from "../redux/reducers/misc";

import toast from "react-hot-toast";

const ConfirmDeleteDialog = lazy(
  () => import("../components/dialogs/ConfirmDeleteDialog"),
);

const AddMemberDialog = lazy(
  () => import("../components/dialogs/AddMemberDialog"),
);

const Groups = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAddMember } = useSelector((state) => state.misc);

  const [searchParams] = useSearchParams();
  const chatId = searchParams.get("group");

  const myGroups = useMyGroupsQuery("");

  const groupDetails = useChatDetailsQuery(
    {
      chatId,
      populate: true,
    },
    {
      skip: !chatId,
    },
  );

  const [updateGroup, isLoadingGroupName] = useAsyncMutation(
    useRenameGroupMutation,
  );

  const [removeMember, isLoadingRemoveMember] = useAsyncMutation(
    useRemoveGroupMemberMutation,
  );

  const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutation(
    useDeleteChatMutation,
  );

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isEdit, setIsEdit] = useState(false);

  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);

  const [groupName, setGroupName] = useState("");
  const [groupNameUpdated, setGroupNameUpdated] = useState("");

  const [members, setMembers] = useState([]);

  const errors = [
    {
      isError: myGroups.isError,
      error: myGroups.error,
    },
    {
      isError: groupDetails.isError,
      error: groupDetails.error,
    },
  ];

  useErrors(errors);

  useEffect(() => {
    if (groupDetails.data?.chat) {
      const group = groupDetails.data.chat;

      setGroupName(group.name || "");
      setGroupNameUpdated(group.name || "");
      setMembers(group.members || []);
      setIsEdit(false);
    } else {
      setGroupName("");
      setGroupNameUpdated("");
      setMembers([]);
      setIsEdit(false);
    }
  }, [groupDetails.data]);

  const navigateBack = () => {
    navigate("/");
  };

  const handleMobile = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleMobileClose = () => {
    setIsMobileMenuOpen(false);
  };

  const updateGroupName = async () => {
    const trimmedName = groupNameUpdated.trim();

    if (!trimmedName) {
      toast.error("Group name cannot be empty");
      return;
    }

    if (trimmedName === groupName) {
      setIsEdit(false);
      return;
    }

    await updateGroup("Updating group name...", {
      chatId,
      name: trimmedName,
    });

    setGroupName(trimmedName);
    setGroupNameUpdated(trimmedName);
    setIsEdit(false);
  };

  const openConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(true);
  };

  const closeConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(false);
  };

  const deleteHandler = async () => {
    await deleteGroup("Deleting group...", chatId);

    closeConfirmDeleteHandler();
    navigate("/");
  };

  const openAddMemberHandler = () => {
    dispatch(setIsAddMember(true));
  };

  const removeMemberHandler = async (userId) => {
    await removeMember("Removing member...", {
      chatId,
      userId,
    });

    setMembers((prev) => prev.filter((member) => member._id !== userId));
  };

  const IconButtons = (
    <>
      {/* Mobile menu */}
      <Stack
        sx={{
          display: {
            xs: "block",
            sm: "none",
          },
          position: "fixed",
          right: "0.75rem",
          top: "0.75rem",
          zIndex: 10,
        }}
      >
        <IconButton
          onClick={handleMobile}
          sx={{
            bgcolor: "background.paper",
            boxShadow: 2,
          }}
        >
          <MenuIcon />
        </IconButton>
      </Stack>

      {/* Back */}
      <Tooltip title="Back">
        <IconButton
          sx={{
            position: "absolute",
            top: {
              xs: "1rem",
              sm: "2rem",
            },
            left: {
              xs: "1rem",
              sm: "2rem",
            },
            bgcolor: matBlack,
            color: "white",

            "&:hover": {
              bgcolor: "black",
            },
          }}
          onClick={navigateBack}
        >
          <KeyboardBackspaceIcon />
        </IconButton>
      </Tooltip>
    </>
  );

  const GroupName = (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      spacing={1}
      sx={{
        width: "100%",
        padding: {
          xs: "3.5rem 2.5rem 1.5rem",
          sm: "3rem",
        },
        boxSizing: "border-box",
      }}
    >
      {isEdit ? (
        <>
          <TextField
            size="small"
            value={groupNameUpdated}
            onChange={(e) => setGroupNameUpdated(e.target.value)}
            autoFocus
            inputProps={{
              maxLength: 50,
            }}
            sx={{
              width: {
                xs: "70%",
                sm: "300px",
              },
            }}
          />

          <Tooltip title="Save">
            <span>
              <IconButton
                color="success"
                onClick={updateGroupName}
                disabled={isLoadingGroupName || !groupNameUpdated.trim()}
              >
                {isLoadingGroupName ? (
                  <CircularProgress size={22} />
                ) : (
                  <DoneIcon />
                )}
              </IconButton>
            </span>
          </Tooltip>
        </>
      ) : (
        <>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              textAlign: "center",
              wordBreak: "break-word",
            }}
          >
            {groupName}
          </Typography>

          <Tooltip title="Edit group name">
            <span>
              <IconButton
                onClick={() => setIsEdit(true)}
                disabled={isLoadingGroupName}
              >
                <EditIcon />
              </IconButton>
            </span>
          </Tooltip>
        </>
      )}
    </Stack>
  );

  const ButtonGroup = (
    <Stack
      direction={{
        xs: "column-reverse",
        sm: "row",
      }}
      spacing={1}
      sx={{
        width: "100%",
        maxWidth: "45rem",
        padding: {
          xs: "1rem 0",
          sm: "1rem",
          md: "1rem 4rem",
        },
        boxSizing: "border-box",
      }}
    >
      <Button
        fullWidth
        size="large"
        color="error"
        variant="outlined"
        startIcon={<DeleteIcon />}
        onClick={openConfirmDeleteHandler}
        disabled={isLoadingDeleteGroup}
      >
        Delete Group
      </Button>

      <Button
        fullWidth
        size="large"
        color="success"
        variant="contained"
        startIcon={<AddIcon />}
        onClick={openAddMemberHandler}
      >
        Add Member
      </Button>
    </Stack>
  );

  return myGroups.isLoading ? (
    <LayoutLoader />
  ) : (
    <Grid
      container
      sx={{
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Grid
        item
        sm={4}
        sx={{
          display: {
            xs: "none",
            sm: "block",
          },
          height: "100%",
          overflow: "hidden",
        }}
      >
        <GroupsList myGroups={myGroups?.data?.groups} chatId={chatId} />
      </Grid>

      <Grid
        item
        xs={12}
        sm={8}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          width: "100%",
          height: "100%",
          padding: {
            xs: "0.75rem 1rem",
            sm: "1rem 2rem",
            md: "1rem 3rem",
          },
          boxSizing: "border-box",
          overflowX: "hidden",
          overflowY: "hidden",
        }}
      >
        {IconButtons}

        {groupName && (
          <>
            {GroupName}

            <Typography
              sx={{
                mb: 1,
                fontWeight: 600,
              }}
              variant="body1"
            >
              Members ({members.length})
            </Typography>
            <Stack
              sx={{
                width: "100%",
                maxWidth: "45rem",
                boxSizing: "border-box",

                height: {
                  xs: "calc(100vh - 250px)",
                  sm: "50vh",
                  md: "55vh",
                },

                overflowY: "auto",
                overflowX: "hidden",

                padding: {
                  xs: "0.25rem",
                  sm: "1rem",
                  md: "1rem 2rem",
                },

                gap: {
                  xs: "0.5rem",
                  sm: "1rem",
                },

                "&::-webkit-scrollbar": {
                  width: "5px",
                },

                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(0,0,0,0.25)",
                  borderRadius: "10px",
                },
              }}
            >
              {members.length > 0 ? (
                members.map((member) => (
                  <UserItem
                    user={member}
                    key={member._id}
                    isAdded={true}
                    actionType="member"
                    handler={removeMemberHandler}
                    handlerIsLoading={isLoadingRemoveMember}
                    styling={{
                      width: "100%",
                      boxShadow: "0 1px 5px rgba(0,0,0,0.12)",
                      padding: {
                        xs: "0.6rem 0.75rem",
                        sm: "0.75rem 1rem",
                      },
                      borderRadius: "0.75rem",
                      boxSizing: "border-box",
                    }}
                  />
                ))
              ) : (
                <Typography
                  textAlign="center"
                  color="text.secondary"
                  sx={{
                    mt: 3,
                  }}
                >
                  No members found
                </Typography>
              )}
            </Stack>

            {ButtonGroup}
          </>
        )}
      </Grid>

      {isAddMember && (
        <Suspense fallback={<Backdrop open />}>
          <AddMemberDialog chatId={chatId} />
        </Suspense>
      )}

      {confirmDeleteDialog && (
        <Suspense fallback={<Backdrop open />}>
          <ConfirmDeleteDialog
            open={confirmDeleteDialog}
            handleClose={closeConfirmDeleteHandler}
            deleteHandler={deleteHandler}
          />
        </Suspense>
      )}

      <Drawer
        sx={{
          display: {
            xs: "block",
            sm: "none",
          },
        }}
        PaperProps={{
          sx: {
            width: {
              xs: "80vw",
              sm: "50vw",
            },
            maxWidth: "320px",
          },
        }}
        open={isMobileMenuOpen}
        onClose={handleMobileClose}
      >
        <GroupsList myGroups={myGroups?.data?.groups} chatId={chatId} />
      </Drawer>
    </Grid>
  );
};
const GroupsList = ({ w = "100%", myGroups = [], chatId }) => (
  <Stack
    width={w}
    height="100%"
    sx={{
      backgroundImage: bgGradient,
      overflowY: "auto",
      overflowX: "hidden",
      "&::-webkit-scrollbar": {
        width: "5px",
      },

      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "rgba(0,0,0,0.25)",
        borderRadius: "10px",
      },
    }}
  >
    {myGroups.length > 0 ? (
      myGroups.map((group) => (
        <GroupListItem group={group} chatId={chatId} key={group._id} />
      ))
    ) : (
      <Typography textAlign="center" padding="1rem">
        No groups
      </Typography>
    )}
  </Stack>
);

const GroupListItem = memo(({ group, chatId }) => {
  const { name, avatar, _id } = group;

  return (
    <Link
      to={`?group=${_id}`}
      onClick={(e) => {
        if (chatId === _id) {
          e.preventDefault();
        }
      }}
      sx={{
        width: "100%",
        boxSizing: "border-box",
        padding: {
          xs: "0.75rem",
          sm: "1rem",
        },
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{
          minWidth: 0,
        }}
      >
        <AvatarCard avatar={avatar} />

        <Typography
          sx={{
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontWeight: chatId === _id ? 600 : 400,
          }}
        >
          {name}
        </Typography>
      </Stack>
    </Link>
  );
});

export default Groups;
