import { useFileHandler, useInputValidation } from "6pp";
import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { VisuallyHiddenInput } from "../components/styles/StyledComponent";
import { server } from "../constants/config";
import { userExists } from "../redux/reducers/auth";
import { usernameValidator } from "../utils/validators";
import { bgGradient } from "../constants/color";

const Login = () => {
  const [login, setLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const toggleLogin = () => setLogin((prev) => !prev);

  const name = useInputValidation("");
  const bio = useInputValidation("");
  const username = useInputValidation("", usernameValidator);
  const password = useInputValidation("");
  const avatar = useFileHandler("single");

  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Logging in...");
    setIsLoading(true);

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        {
          username: username.value.trim(),
          password: password.value,
        },
        config,
      );

      dispatch(userExists(data.user));

      toast.success(data.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!avatar.file) {
      return toast.error("Please select a profile picture");
    }

    const toastId = toast.loading("Signing up...");
    setIsLoading(true);

    const formData = new FormData();

    formData.append("avatar", avatar.file);
    formData.append("name", name.value.trim());
    formData.append("bio", bio.value.trim());
    formData.append("username", username.value.trim());
    formData.append("password", password.value);

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/signup`,
        formData,
        config,
      );

      dispatch(userExists(data.user));

      toast.success(data.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: bgGradient,
        minHeight: "100vh",
      }}
    >
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 3,
          }}
        >
          {login ? (
            <>
              {/* ================= LOGIN ================= */}

              <Typography variant="h5" fontWeight={600}>
                Login <span className="title">ChatApp</span>
              </Typography>

              <form
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                onSubmit={handleLogin}
              >
                <TextField
                  required
                  fullWidth
                  label="Username"
                  margin="normal"
                  variant="outlined"
                  value={username.value}
                  onChange={username.changeHandler}
                  autoComplete="username"
                />

                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  margin="normal"
                  variant="outlined"
                  value={password.value}
                  onChange={password.changeHandler}
                  autoComplete="current-password"
                />

                <Button
                  sx={{
                    marginTop: "1rem",
                  }}
                  fullWidth
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>

                <Typography textAlign="center" m="1rem" color="text.secondary">
                  OR
                </Typography>

                <Button
                  fullWidth
                  variant="text"
                  onClick={toggleLogin}
                  disabled={isLoading}
                >
                  Sign Up Instead
                </Button>
              </form>
            </>
          ) : (
            <>
              {/* ================= SIGN UP ================= */}

              <Typography variant="h5" fontWeight={600}>
                Sign Up <span className="title">ChatApp</span>
              </Typography>

              <form
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                onSubmit={handleSignUp}
              >
                {/* Avatar */}

                <Stack position="relative" width="10rem" margin="auto">
                  <Avatar
                    sx={{
                      width: "10rem",
                      height: "10rem",
                      objectFit: "contain",
                    }}
                    src={avatar.preview}
                  />

                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      color: "white",
                      bgcolor: "rgba(0,0,0,0.5)",

                      ":hover": {
                        bgcolor: "rgba(0,0,0,0.8)",
                      },
                    }}
                    component="label"
                  >
                    <CameraAltIcon />

                    <VisuallyHiddenInput
                      type="file"
                      accept="image/*"
                      onChange={avatar.changeHandler}
                    />
                  </IconButton>
                </Stack>

                {avatar.error && (
                  <Typography
                    m="1rem auto"
                    width="fit-content"
                    display="block"
                    color="error"
                    variant="caption"
                  >
                    {avatar.error}
                  </Typography>
                )}

                <TextField
                  required
                  fullWidth
                  label="Name"
                  margin="normal"
                  variant="outlined"
                  value={name.value}
                  onChange={name.changeHandler}
                  autoComplete="name"
                />

                <TextField
                  required
                  fullWidth
                  label="Bio"
                  margin="normal"
                  variant="outlined"
                  value={bio.value}
                  onChange={bio.changeHandler}
                  autoComplete="off"
                />

                <TextField
                  required
                  fullWidth
                  label="Username"
                  margin="normal"
                  variant="outlined"
                  value={username.value}
                  onChange={username.changeHandler}
                  autoComplete="username"
                />

                {username.error && (
                  <Typography color="error" variant="caption">
                    {username.error}
                  </Typography>
                )}

                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  margin="normal"
                  variant="outlined"
                  value={password.value}
                  onChange={password.changeHandler}
                  autoComplete="new-password"
                />

                <Button
                  sx={{
                    marginTop: "1rem",
                  }}
                  fullWidth
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing up..." : "Sign Up"}
                </Button>

                <Typography textAlign="center" m="1rem" color="text.secondary">
                  OR
                </Typography>

                <Button
                  fullWidth
                  variant="text"
                  onClick={toggleLogin}
                  disabled={isLoading}
                >
                  Login Instead
                </Button>
              </form>
            </>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
