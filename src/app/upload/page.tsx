"use client";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";

export default function UploadPage() {
  const { control, handleSubmit } = useForm();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFilesChange = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setSelectedFiles(fileArray);
    }
  };

  const onSubmit = async (data) => {
    console.log("Form Data: ", data);

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append("files", file));
      formData.append("name", data.name);

      const response = await axios.post(
        "http://localhost:3000/api/product",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const VisuallyHiddenInput = useMemo(() => {
    return styled("input")({
      display: "none",
    });
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h4" textAlign="center" sx={{ pt: 5, fontSize: "2rem" }}>
          IMAGE UPLOAD PAGE
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            px: 2,
            py: 4,
            maxWidth: "1200px",
            mx: "auto",
          }}
        >
          {/* Image Upload Section */}
          <Box sx={{ mb: 3, mx: 2, width: { xs: "100%", md: "50%" } }}>
            <Box
              sx={{
                width: "100%",
                height: { xs: 200, md: 300 },
                borderRadius: 4,
                bgcolor: "#9b9b9b",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: 3,
                overflow: "hidden",
              }}
            >
              {selectedFiles.length === 0 ? (
                <>
                  <CloudUploadIcon sx={{ color: "#121212", width: 100, height: 100 }} />
                  <Typography variant="body1" sx={{ color: "#121212", mt: 1 }}>
                    Product Image
                  </Typography>
                </>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    width: "100%",
                    height: "100%",
                    overflowY: "auto",
                    borderRadius: 2,
                    bgcolor: "#e0e0e0",
                    p: 1,
                  }}
                >
                  {selectedFiles.map((file, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: "100%",
                        height: "auto",
                        paddingTop: "50%",
                        backgroundImage: `url(${URL.createObjectURL(file)})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderRadius: 1,
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>

            {/* Hidden Input for Device File Upload */}
            <Controller
              name="files"
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  sx={{ width: "100%", mb: 2 }}
                >
                  Upload From Device
                  <VisuallyHiddenInput
                    type="file"
                    multiple
                    onChange={(event) => {
                      const files = event.target.files
                        ? Array.from(event.target.files)
                        : [];
                      handleFilesChange(event.target.files);
                      field.onChange(files);
                    }}
                  />
                </Button>
              )}
            />

            {/* Camera Input for Mobile Devices */}
            <Button
              component="label"
              variant="contained"
              startIcon={<CameraAltIcon />}
              sx={{ width: "100%" }}
            >
              Open Camera
              <VisuallyHiddenInput
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(event) => {
                  const files = event.target.files
                    ? Array.from(event.target.files)
                    : [];
                  handleFilesChange(event.target.files);
                }}
              />
            </Button>
          </Box>

          {/* Product Details Section */}
          <Box sx={{ mx: 2, width: { xs: "100%", md: "50%" } }}>
            <Stack spacing={2}>
              <TextField required label="Product ID" />
              <TextField required label="Shirt Size" />
              <TextField required label="Quantity" />
              <Button variant="contained" endIcon={<SendIcon />} sx={{ mt: 2 }} type="submit">
                Send
              </Button>
            </Stack>
          </Box>
        </Box>
      </form>
    </>
  );
}
