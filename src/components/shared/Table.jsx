import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Container, Paper, Typography, Box } from "@mui/material";
import { matBlack } from "../../constants/color";

const Table = ({ rows = [], columns = [], heading, rowHeight = 50 }) => {
  return (
    <Container
      maxWidth={false}
      sx={{
        height: "100%",
        width: "100%",
        px: {
          xs: 1,
          sm: 2,
          md: 3,
        },
        py: {
          xs: 1,
          sm: 2,
        },
        boxSizing: "border-box",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: {
            xs: 1,
            sm: 2,
            md: 3,
          },
          margin: "auto",
          borderRadius: {
            xs: "0.5rem",
            sm: "1rem",
          },
          width: "100%",
          height: "100%",
          overflow: "hidden",
          boxShadow: "none",
          boxSizing: "border-box",
        }}
      >
        {/* Heading */}
        <Typography
          textAlign="center"
          variant="h5"
          sx={{
            my: {
              xs: 1,
              sm: 2,
              md: 3,
            },
            fontSize: {
              xs: "1.1rem",
              sm: "1.4rem",
              md: "1.5rem",
            },
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          {heading}
        </Typography>

        {/* DataGrid wrapper */}
        <Box
          sx={{
            width: "100%",
            height: {
              xs: "calc(100% - 4rem)",
              sm: "calc(100% - 5rem)",
            },
            overflowX: "auto",
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            rowHeight={rowHeight}
            disableRowSelectionOnClick
            sx={{
              border: "none",

              /* Header */
              "& .table-header": {
                backgroundColor: matBlack,
                color: "white",
                fontWeight: 600,
              },

              /* Header text */
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: 600,
              },

              /* Cells */
              "& .MuiDataGrid-cell": {
                fontSize: {
                  xs: "0.8rem",
                  sm: "0.875rem",
                },
              },

              /* Remove focus outline */
              "& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus": {
                outline: "none",
              },

              /* Mobile */
              "& .MuiDataGrid-columnHeaders": {
                minHeight: {
                  xs: "45px !important",
                  sm: "56px !important",
                },
              },
            }}
          />
        </Box>
      </Paper>
    </Container>
  );
};

export default Table;
