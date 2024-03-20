import { Box, Card, CardContent, Button } from "@mui/material";
import React, { useState, ChangeEvent, useRef } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Papa from "papaparse";
import api from "../../services/ApiService";
import { ApiResponse } from "../../models/ApiResponse";
import { toast } from "react-toastify";

/**
 * @description  This code snippet defines a React component called BulkUpdate.
 * It provides functionality for uploading a CSV file, processing the data, and updating records on the server.
 * The component includes functions for handling file change, clearing the input, browsing for a file, submitting the file, and downloading a sample CSV.
 * The component also includes JSX for rendering file input, buttons, and error messages.
 * 
 * @param {React.ChangeEvent<HTMLInputElement>} event - The change event object.
 * @return {void} No return value.
 */
const BulkUpdate = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<any[]>([]);
  const [columnData, setColumnData] = useState<any[]>([]);
  const [isError, setIsError] = useState<boolean>(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    setSelectedFile(file);
  };

  const handleClear = () => {
    setColumnData([]);
    setFileData([]);
    setIsError(false);
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
        .put<ApiResponse<any>>("/Item/bulk-update", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          if (response.isSuccess) {
            if (response.data.recordsUpdated) {
              Papa.parse(selectedFile, {
                complete: (result) => {
                  const rowData = result?.data?.slice(1); // Exclude header row

                  const filteredArray =
                    response?.data?.recordsNotUpdated > 0
                      ? rowData?.filter((item: any) => {
                          return response?.data?.misMatchedItemIDs?.includes(
                            Number(item?.PrjCode)
                          );
                        })
                      : "";
                  const columns = filteredArray
                    ? Object.keys(filteredArray[0]).map((field) => ({
                        field: field == "PrjCode" ? "id" : field,
                        headerName: field,
                        width: 150,
                      }))
                    : [];

                  const convertedData = filteredArray
                    ? filteredArray.map((item: any) => {
                        const updatedItem = { ...item, id: item.PrjCode };
                        delete updatedItem.Id;
                        return updatedItem;
                      })
                    : [];

                  toast.success(response.message);

                  if (response?.data?.recordsNotUpdated > 0) {
                    setIsError(true);
                    setSelectedFile(null);
                  } else {
                    setSelectedFile(null);
                    setIsError(false);
                  }
                  fileInputRef.current.value = "";
                  setColumnData(columns);
                  setFileData(convertedData);
                },
                header: true,
              });
            } else {
              setSelectedFile(null);
              toast.success(response.message);
            }
          } else {
            throw new Error(response.message);
          }
        })
        .catch((error) => {
          console.log("Exception from update file", error);
          toast.error(error.message);
        });
    } else {
      toast.error("Upload file less than 5MB");
    }
  };
  const handleUpdateSampleDownload = () => {
    const demoCsvUrl = "./updateSample.csv";
    const link = document.createElement("a");
    link.href = demoCsvUrl;
    link.setAttribute("download", "sampleUpdate.csv");
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
            <p style={{ margin: "0px" }}>Bulk Data Update </p>
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
                  onClick={handleUpdateSampleDownload}
                  style={{ cursor: "pointer" }}
                >
                  <strong>Download sample CSV for bulk update</strong>
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

          {isError ? (
            <>
              <div
                style={{
                  color: "red",
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
                <p style={{ margin: "0px" }}>Below fields cannot be updated </p>
              </div>
              <Box sx={{ height: "100%", width: "100%" }}>
                {fileData.length > 0 && (
                  <DataGrid
                    rows={fileData}
                    columns={columnData}
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{
                      toolbar: {
                        showQuickFilter: true,
                      },
                    }}
                    disableColumnFilter
                    disableColumnSelector
                    disableDensitySelector
                  />
                )}
              </Box>
            </>
          ) : (
            ""
          )}
        </CardContent>
      </Card>
    </>
  );
};
export default BulkUpdate;
