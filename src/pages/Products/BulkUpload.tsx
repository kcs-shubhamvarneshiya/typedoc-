import { Box, Card, CardContent, Button } from "@mui/material";
import React, { useState, ChangeEvent, useRef } from "react";
import api from "../../services/ApiService";
import { ApiResponse } from "../../models/ApiResponse";
import { toast } from "react-toastify";
/**
 * This code snippet creates a React component for bulk uploading files.
 * It allows users to select a file, submit it to a server, clear the selection, and download a sample file.
 * The component shows a success message if the file upload is successful.
 *
 */
const BulkUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    setSelectedFile(file);
  };

  const handleClear = () => {
    setIsSuccess(false);
    setSelectedFile(null);
    fileInputRef.current.value = "";
  };
  const fileInputRef = useRef(null);

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };
  const handleSubmit = async () => {
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    const formData = new FormData();
    if (selectedFile.size < maxSizeInBytes) {
      formData.append("file", selectedFile); // Assuming 'file' is the key expected by the server
      api
        .post<ApiResponse<any>>("/Item/bulk-create", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          if (response.isSuccess) {
            setSelectedFile(null);
            setIsSuccess(true);
            toast.success(response.message);
            fileInputRef.current.value = "";
          }
        })
        .catch((error) => {
          console.log("Exception from update file", error);
        });
    } else {
      toast.error("Upload file less than 5MB");
    }
  };
  const handleUploadSampleDownload = () => {
    const demoCsvUrl = "./uploadSample.csv";
    const link = document.createElement("a");
    link.href = demoCsvUrl;
    link.setAttribute("download", "sampleUpload.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Card sx={{ marginBottom: 1 }}>
        <CardContent>
          <div
            style={{
              color: "#454545",
              padding: "20px",
              borderBottom: "1px solid #ccc",
              fontFamily: "Goudy Old Style",
              fontSize: "20px",
              fontStyle: "normal",
              fontWeight: "400",
              lineHeight: "normal",
              textTransform: "capitalize",
            }}
          >
            <p style={{ margin: "0px" }}>Bulk Data Upload </p>
          </div>

          <Box sx={{ height: 1, backgroundColor: "#ccc" }} />

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-start",
              padding: "20px",
            }}
          >
            <input
              type="file"
              id="fileInput"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
              accept=".csv"
            />
            <div
              className="inputWrap"
              style={{ width: "40%", marginRight: "10px", maxWidth: "100%" }}
            >
              <input
                type="text"
                name="fileName"
                id="fileName"
                value={selectedFile ? selectedFile.name : ""}
                style={{
                  width: "100%",
                  height: "35px",
                }}
                readOnly
              />

              <p
                style={{
                  color: "#717171",
                  fontFamily: "Proxima Nova",
                  fontSize: "12px",
                  fontStyle: "normal",
                  fontWeight: "400",
                  lineHeight: "normal",
                  letterSpacing: "0.17px",
                }}
              >
                CSV (max. 5MB).
                <span
                  onClick={handleUploadSampleDownload}
                  style={{ cursor: "pointer" }}
                >
                  <strong>Download sample CSV for bulk create</strong>
                </span>
              </p>
            </div>

            <Button
              onClick={handleBrowseClick}
              variant="contained"
              style={{
                borderRadius: "0px",
                border: "0.5px solid grey",
                width: "150px",
                height: "35px",
                marginRight: "10px",
              }}
            >
              Browse
            </Button>

            <Button
              onClick={handleSubmit}
              style={{
                borderRadius: "0px",
                border: "0.5px solid grey",
                width: "150px",
                height: "35px",
                marginRight: "10px",
              }}
              disabled={selectedFile ? false : true}
            >
              Submit
            </Button>
            <Button
              onClick={handleClear}
              style={{
                borderRadius: "0px",
                border: "0.5px solid grey",
                width: "150px",
                height: "35px",
              }}
            >
              Clear
            </Button>
          </Box>
          {isSuccess ? (
            <>
              <div
                style={{
                  color: "green",
                  padding: "20px",
                  borderBottom: "1px solid #ccc",
                  fontFamily: "Goudy Old Style",
                  fontSize: "20px",
                  fontStyle: "normal",
                  fontWeight: "400",
                  lineHeight: "normal",
                  textTransform: "capitalize",
                }}
              >
                <p style={{ margin: "0px" }}>
                  File has been uploaded successfully
                </p>
              </div>
            </>
          ) : (
            ""
          )}
        </CardContent>
      </Card>
    </>
  );
};
export default BulkUpload;
