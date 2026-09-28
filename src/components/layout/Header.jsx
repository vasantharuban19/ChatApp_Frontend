import { Suspense, lazy, useState } from "react";
import {
  AppBar,
  Backdrop,
  Badge,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import { green } from "../../constants/color";
import { Menu as MenuIcon } from "@mui/icons-material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../constants/config";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { userNotExists } from "../../redux/reducers/auth";
import {
  setIsMobileMenu,
  setIsNewGroup,
  setIsNotification,
  setIsSearch,
} from "../../redux/reducers/misc";
import { resetNotificationCount } from "../../redux/reducers/chat";

const SearchDialog = lazy(() => import("../specific/Search"));
const NotifcationsDialog = lazy(() => import("../specific/Notifications"));
const NewGroupDialog = lazy(() => import("../specific/NewGroup"));

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isSearch, isNotification, isNewGroup } = useSelector(
    (state) => state.misc,
  );

  const { notificationCount } = useSelector((state) => state.chat);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleMobile = () => {
    dispatch(setIsMobileMenu(true));
  };
  const openSearch = () => {
    dispatch(setIsSearch(true));
  };
  const openNewGroup = () => {
    dispatch(setIsNewGroup(true));
  };
  const navigateToGroup = () => navigate("/groups");

  const openNotification = () => {
    dispatch(setIsNotification(true));
    dispatch(resetNotificationCount());
  };

  const handleLogoutClick = () => {
    setOpenLogoutDialog(true);
  };

  const handleLogoutCancel = () => {
    if (isLoggingOut) return;
    setOpenLogoutDialog(false);
  };

  const logoutHandler = async () => {
    try {
      setIsLoggingOut(true);

      const { data } = await axios.get(`${server}/api/v1/user/logout`, {
        withCredentials: true,
      });

      dispatch(userNotExists());
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }} height={"4rem"}>
        <AppBar
          position="static"
          sx={{
            bgcolor: green,
          }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              sx={{
                display: { xs: "none", sm: "block" },
                fontSize: { xs: "1rem", sm: "1.25rem" },
                fontWeight: 600,
              }}
            >
              ChatApp
            </Typography>
            <Box
              sx={{
                display: { xs: "block", sm: "none" },
              }}
            >
              <IconButton color="inherit" onClick={handleMobile}>
                <MenuIcon />
              </IconButton>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
              }}
            />
            <Box>
              <IconBtn
                title={"Search"}
                icon={<SearchIcon />}
                onClick={openSearch}
              />
              <IconBtn
                title={"New Group"}
                icon={<AddIcon />}
                onClick={openNewGroup}
              />
              <IconBtn
                title={"Manage Groups"}
                icon={<GroupIcon />}
                onClick={navigateToGroup}
              />
              <IconBtn
                title={"Notifications"}
                icon={<NotificationsIcon />}
                onClick={openNotification}
                value={notificationCount}
              />
              <IconBtn
                title={"Logout"}
                icon={<LogoutIcon />}
                onClick={handleLogoutClick}
              />
            </Box>
          </Toolbar>
        </AppBar>
      </Box>

      <Dialog
        open={openLogoutDialog}
        onClose={handleLogoutCancel}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Logout</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ padding: "1rem" }}>
          <Button onClick={handleLogoutCancel} disabled={isLoggingOut}>
            Cancel
          </Button>

          <Button
            onClick={logoutHandler}
            color="error"
            variant="contained"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Logout"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {isSearch && (
        <Suspense
          fallback={
            <Backdrop open>
              <CircularProgress color="inherit" />
            </Backdrop>
          }
        >
          <SearchDialog />
        </Suspense>
      )}
      {isNotification && (
        <Suspense
          fallback={
            <Backdrop open>
              <CircularProgress color="inherit" />
            </Backdrop>
          }
        >
          <NotifcationsDialog />
        </Suspense>
      )}
      {isNewGroup && (
        <Suspense
          fallback={
            <Backdrop open>
              <CircularProgress color="inherit" />
            </Backdrop>
          }
        >
          <NewGroupDialog />
        </Suspense>
      )}
    </>
  );
};

const IconBtn = ({ title, icon, onClick, value }) => {
  return (
    <Tooltip title={title}>
      <IconButton color="inherit" size="large" onClick={onClick}>
        {value ? (
          <Badge badgeContent={value} color="error" max={99}>
            {icon}
          </Badge>
        ) : (
          icon
        )}
      </IconButton>
    </Tooltip>
  );
};

export default Header;
