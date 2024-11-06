"use client";
import * as React from "react";
import { Typography, Button, Box, Stack, TextField, FormControl, FormLabel } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SaveIcon from "@mui/icons-material/Save";
import { styled } from "@mui/material/styles";
import { useMemo } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export default function EditProductInfoPage({ params }) {
  const { sku } = React.use(params);
  const [alignment, setAlignment] = React.useState("available");
  // const [ showImage , setShowingImage ] = React.useState('');

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    setAlignment(newAlignment);
  };

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
      <Typography
        variant="h4"
        component="h2"
        textAlign="center"
        sx={{ pt: { xs: 5, md: 10 }, fontSize: { xs: "1.5rem", md: "2rem" } }}
      >
        Edit Product Information: {sku}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "auto",
          mx: "auto",
          p: { xs: 2, md: 5 },
        }}
      >
        <Box sx={{ mx: { xs: 0, md: 5 }, mb: { xs: 3, md: 0 }, width: { xs: "100%", md: "auto" } }}>
          <Box
            sx={{
              width: { xs: "100%", sm: 200, lg: 400 },
              height: { xs: 150, sm: 200, lg: 300 },
              borderRadius: 6,
              bgcolor: "#9b9b9b",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              mb: 2,
            }}
          >
            <CloudUploadIcon
              sx={{
                color: "#121212",
                width: { xs: 100, sm: 150, lg: 200 },
                height: { xs: 100, sm: 150, lg: 200 },
                alignSelf: "center",
              }}
            />
            <Typography variant="h6" textAlign="center" sx={{ color: "#121212", mt: 1 }}>
              Product Image
            </Typography>
          </Box>
        </Box>
        <Box sx={{ width: { xs: "auto", md: "auto" }, px: { xs: 1, sm: 3, md: 5 } }}>
          <Stack spacing={2}>
            <TextField
              required
              disabled
              id="outlined-required"
              label="SKU"
              type="string"
              sx={{ my: 1.5 }}
              fullWidth
            />
            <FormControl sx={{ my: 1.5 }}>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Size
              </FormLabel>
              <ToggleButtonGroup
                color="primary"
                value={alignment}
                exclusive
                onChange={handleChange}
                aria-label="Product Status"
                fullWidth
              >
                <ToggleButton value="available" sx={{ textTransform: "uppercase" }}>
                  Available
                </ToggleButton>
                <ToggleButton value="working" sx={{ textTransform: "uppercase" }}>
                  Working
                </ToggleButton>
                <ToggleButton value="sold-out" sx={{ textTransform: "uppercase" }}>
                  Sold-out
                </ToggleButton>
                <ToggleButton value="expired" sx={{ textTransform: "uppercase" }}>
                  Expired
                </ToggleButton>
                <ToggleButton value="not-active" sx={{ textTransform: "uppercase" }}>
                  Not-Active
                </ToggleButton>
              </ToggleButtonGroup>
            </FormControl>
            <Button variant="contained" endIcon={<SaveIcon />} sx={{ my: 1.5 }}>
              Update
            </Button>
          </Stack>
        </Box>
      </Box>
    </>
  );
}
