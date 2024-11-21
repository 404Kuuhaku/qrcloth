"use client";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { List, ListItem, ListItemText, TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Button from "@mui/material/Button";
import { useMemo , useState } from "react";
import { styled } from "@mui/material/styles";

export default function QRCodeScanPage() {
  const [inputValue, setInputValue] = useState("");
  const VisuallyHiddenInput = useMemo(() => {
    return styled("input")({
      clip: "rect(0 0 0 0)",
      clipPath: "inset(50%)",
      height: 1,
      overflow: "hidden",
      position: "absolute",
      bottom: 0,
      left: 0,
      whiteSpace: "nowrap",
      width: 1,
    });
  }, []);
  return (
    <>
      <Box
        sx={{
          position: "fixed",
          left: 20,
          top: "20%",
          transform: "translateY(-50%)",
          width: 100,
          padding: 2,
          // backgroundColor: "#B8B8B8",
          boxShadow: 3,
          borderRadius: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <List>
          <ListItem button component="a" href="/table">
            <ListItemText primary="Table" />
          </ListItem>
          <ListItem button component="a" href="/upload">
            <ListItemText primary="Upload" />
          </ListItem>
          <ListItem button component="a" href="/qrscan">
            <ListItemText primary="QR Scan" />
          </ListItem>
        </List>
      </Box>
      {/* <Typography
        variant="h2"
        component="h2"
        textAlign="center"
        sx={{ pt: 10 }}
      >
        QR CODE SCAN PAGE
      </Typography> */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "80vw",
          height: "70vh",
          mx: "auto",
        }}
      >
        <Box>
          <Box
            sx={{
              width: {
                xs: 200,
                lg: 400,
              },
              height: {
                xs: 150,
                lg: 300,
              },
              borderRadius: 6,
              // bgcolor: "primary.main",
              bgcolor: "#9b9b9b",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              mb: 5,
			  mr : 10,
              // "&:hover": {
              // 	bgcolor: "#5b5b5b",
              // },
            }}
          >
            <QrCodeScannerIcon
              sx={{
                color: "#121212",
                // mx: "auto",
                width: 200,
                height: 200,
                alignSelf: "center",
              }}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            textAlign: "center",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Enter SKU
          </Typography>
          <TextField
            label="Enter Value"
            variant="outlined"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            sx={{ mb: 2, width: "300px" }}
          />
          <Button
            variant="contained"
            color="primary"
            disabled={!inputValue.trim()}
            href={`/qrscan/${inputValue.trim()}`} // Use href for navigation
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </>
  );
}
