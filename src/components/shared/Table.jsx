import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Container, Paper, Typography } from "@mui/material";
import {matBlack} from '../../constants/color'

const Table = ({ rows, columns, heading, rowHeight = 50 }) => {
  return (
    <Container sx={{ height: "100vh" }}>
      <Paper
      elevation={3}
      sx={{
        padding:'1rem 4rem',
        margin:'auto',
        borderRadius:'1rem',
        width:'100%',
        overflow:'hidden',
        height:'100%',
        boxShadow:'none',
      }}
      >
        <Typography
          textAlign={"center"}
          variant="h5"
          sx={{
            margin: "2rem",
            textTransform: "uppercase",
          }}
        >
          {heading}
        </Typography>
        <DataGrid 
        rows={rows}
        columns={columns}
        rowHeight={rowHeight}
        style={{
            height:'80%',
        }}
        sx={{
            border:'none',
            ".table-header":{
                bgcolor:matBlack,
                color:'white',
            }
        }}
        />
      </Paper>
    </Container>
  );
};

export default Table;
