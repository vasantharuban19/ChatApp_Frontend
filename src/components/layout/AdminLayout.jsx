import React, { useState } from "react";
import {
  darkGreen,
  grayColor,
  green,
  lightBlue,
  matBlack,
  purple,
} from "../../constants/color";
import { useLocation, Link as LinkComponent, Navigate } from "react-router-dom";
import {
  Box,
  Drawer,
  Grid,
  IconButton,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Close as CloseIcon,
  Menu as MenuIcon,
  ManageAccounts as ManageAccountsIcon,
  Groups3 as Groups3Icon,
  Forum as ForumIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { adminLogout } from "../../redux/thunks/admin";

const Link = styled(LinkComponent)`
  text-decoration: none;
  border-radius: 2rem;
  padding: 1rem 1rem;
  color: black;
  display: flex;
  align-items: center;
  gap: 1rem;
  &:hover {
    color: rgba(0, 0, 0, 0.55);
  }
`;

const adminTabs = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <DashboardIcon />,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: <ManageAccountsIcon />,
  },
  {
    name: "Chats",
    path: "/admin/chats",
    icon: <Groups3Icon />,
  },
  {
    name: "Messages",
    path: "/admin/messages",
    icon: <ForumIcon />,
  },
];

const SideBar = ({ w = "100%", onClose }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(adminLogout());
    onClose && onClose();
  };

  return (
    <Stack width={w} direction="column" p={3} spacing={3}>
      <Typography variant="h5" color={darkGreen} textAlign="center">
        Chat App
      </Typography>
      <Stack spacing={1}>
        {adminTabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            sx={
              location.pathname === tab.path
                ? {
                    bgcolor: matBlack,
                    color: "white",
                    "&:hover": { color: "white" },
                  }
                : {}
            }
            onClick={onClose}
          >
            {tab.icon}
            <Typography>{tab.name}</Typography>
          </Link>
        ))}
        <Link
          component="button"
          onClick={logoutHandler}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <LogoutIcon />
          <Typography>Logout</Typography>
        </Link>
      </Stack>
    </Stack>
  );
};

const AdminLayout = ({ children }) => {
  const { isAdmin } = useSelector((state) => state.auth);

  const [isMobile, setIsMobile] = useState(false);

  const handleMobile = () => setIsMobile(!isMobile);

  const handleClose = () => setIsMobile(false);

  if (!isAdmin) return <Navigate to="/admin" />;

  return (
    <Grid container minHeight={"100vh"}>
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
          right: "1rem",
          top: "1rem",
        }}
      >
        <IconButton onClick={handleMobile}>
          {isMobile ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </Box>

      <Grid item md={4} lg={3} sx={{ display: { xs: "none", md: "block" } }}>
        <SideBar />
      </Grid>

      <Grid
        item
        xs={12}
        md={8}
        lg={9}
        sx={{
          bgcolor: grayColor,
        }}
      >
        {children}
      </Grid>

      <Drawer open={isMobile} onClose={handleClose}>
        <SideBar w="50vw" />
      </Drawer>
    </Grid>
  );
};

export default AdminLayout;
