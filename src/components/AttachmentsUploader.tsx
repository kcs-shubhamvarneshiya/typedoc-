/* eslint-disable no-template-curly-in-string */
import React, { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardMedia,
  CardContent,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import api from "../services/ApiService";
import { ApiResponse } from "../models/ApiResponse";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import { CSSDefaults } from "../models/GlobalConstants";
import CloseIcon from "@mui/icons-material/Close";

export type AttachmentsUploaderProps = {
  title: string;
  onChange: (attachments: AttachmentsUploaderState) => void;
};

export type AttachmentsUploaderState = {
  attachmentType: string;
  files: File[];
};

/**
 * Function for handling file uploads, attachment type changes, form submission, and drag and drop functionality.
 *
 * @param {AttachmentsUploaderProps} props - the properties for the AttachmentsUploader component
 * @return {JSX.Element} the AttachmentsUploader component
 */
const AttachmentsUploader = (props: AttachmentsUploaderProps) => {
  const [attachmentValue, setAttachmentValue] =
    useState<AttachmentsUploaderState>({
      attachmentType: "0",
      files: [],
    });
  const [attachmentTypes, setAttachmentTypes] = useState<any>([]);
  const [totalFileSize, setTotalFileSize] = useState<string>("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const getAttachmentTypes = async () => {
      const attachmentTypesApiResult = await api.get<ApiResponse<any>>(
        "/PickList/attachment-types"
      );
      if (attachmentTypesApiResult?.isSuccess) {
        setAttachmentTypes(attachmentTypesApiResult.data || []);
      }
    };

    getAttachmentTypes();
  }, []);

  /**
   * Handles the change event when a file input field's value changes.
   *
   * @param {ChangeEvent<HTMLInputElement>} event - the change event from the input field
   */
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files || [];

    const fileArray = Array.from(fileList);

    attachmentValue.files.push(...fileArray);
    const newStateValue = {
      attachmentType: attachmentValue.attachmentType,
      files: attachmentValue.files,
    };
    setAttachmentValue(newStateValue);
    calculateFileSize();
    props.onChange(newStateValue);
  };

  /**
   * A function that handles the change in attachment type.
   *
   * @param {Event} event - the event triggering the change
   * @return {void}
   */
  const handleAttachmentTypeChange = (event) => {
    const newStateValue = {
      attachmentType: event.target.value,
      files: attachmentValue.files,
    };
    setAttachmentValue(newStateValue);
    props.onChange(newStateValue);
  };

  /**
   * Handle form submission asynchronously.
   *
   * @param {event} event - the event triggering the form submission
   * @return {Promise} a Promise representing the result of the form submission
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();

    attachmentValue.files.forEach((file, index) => {
      formData.append(`attachments[${index}]`, file);
    });

    formData.append("attachmentType", attachmentValue.attachmentType);

    try {
      const response = await axios.post("YOUR_API_ENDPOINT", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  /**
   * Calculate the total size of files in the `attachmentValue` and set the formatted size to state.
   *
   * @param None
   * @return None
   */
  const calculateFileSize = () => {
    const totalSize = attachmentValue.files.reduce(
      (total, file) => total + file.size,
      0
    );
    const formattedSize = formatBytes(totalSize); // Format bytes for better readability
    setTotalFileSize(formattedSize);
  };

  /**
   * A function that formats a given number of bytes into human-readable format.
   *
   * @param {number} bytes - The number of bytes to format.
   * @param {number} decimals - (Optional) The number of decimal places to round to.
   * @return {string} The formatted bytes in a human-readable string.
   */
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  /**
   * A function that handles the removal of a card.
   *
   * @param {number} index - the index of the card to be removed
   */
  const handleRemoveCard = (index) => {
    const updatedAttachments = attachmentValue.files.filter(
      (file, i) => i !== index
    );
    const updatedState = {
      attachmentType: attachmentValue.attachmentType,
      files: updatedAttachments,
    };
    setAttachmentValue(updatedState);
    calculateFileSize();
    props.onChange(updatedState);
  };

  /**
   * A description of the entire function.
   *
   * @param {type} event - description of parameter
   * @return {type} description of return value
   */
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  /**
   * A description of the entire function.
   *
   * @param {type} event - description of parameter
   * @return {type} description of return value
   */
  const handleDrop = (event) => {
    event.preventDefault();
    const fileList = event.dataTransfer.files;

    const fileArray: any = Array.from(fileList);

    attachmentValue.files.push(...fileArray);
    const newStateValue = {
      attachmentType: attachmentValue.attachmentType,
      files: attachmentValue.files,
    };
    setAttachmentValue(newStateValue);
    calculateFileSize();
    props.onChange(newStateValue);
  };

  const { title } = props;
  /**
   * A function that generates text content for a given file name.
   *
   * @param {string} fileName - the name of the file
   * @return {JSX.Element} the Typography component with the file name as text content
   *
   */
  const getFileNameTextContent = (fileName) => (
    <Typography
      variant="body2"
      color="text.secondary"
      style={{
        margin: "10px 0",
        textAlign: "center",
        whiteSpace: "normal",
        wordBreak: "break-word",
      }}
    >
      {`${fileName}`}
    </Typography>
  );
  return (
    <Box
      flexGrow="1"
      display="flex"
      sx={{
        ul: {
          listStyle: "none",
          display: "flex",
          flexDirection: "row",
          li: {
            padding: 1,
            border: `solid 1px ${CSSDefaults.primaryColor}`,
            margin: 1,
            borderRadius: "2px",
          },
        },
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* <form onSubmit={handleSubmit} style={{ width: "100%" }}> */}
      <div style={{ width: "100%" }}>
        <div
          style={{
            margin: "0 0 10px",
            padding: "20px",
            border: "2px dashed #ccc",
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          <input
            ref={fileInputRef}
            id="contained-button-file"
            type="file"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <label htmlFor="contained-button-file">
            <Button
              variant="contained"
              component="span"
              startIcon={<UploadFileOutlinedIcon />}
            >
              {title}
            </Button>
          </label>
          <p>or</p>
          <p>Drag and drop your files here</p>
        </div>

        {attachmentValue.files.length > 0 && (
          <div
            style={{
              display: "inline-block",
              float: "none",
              padding: "10px 0 0",
              verticalAlign: "top",
              width: "100%",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Selected Files (Total Size : {totalFileSize})
            </Typography>
            <Divider />
            <div
              style={{
                display: "inline-flex",
                flexWrap: "wrap",
                padding: "7px 0 0",
              }}
            >
              {attachmentValue.files.map((file, index) => (
                <div key={index} style={{ margin: "8px 15px 8px 0" }}>
                  <Card sx={{ width: 115, overflow: "visible" }}>
                    <CardContent
                      sx={{ padding: 1, pb: 0, position: "relative" }}
                    >
                      <CloseIcon
                        onClick={() => handleRemoveCard(index)} // Add your remove logic here
                        style={{
                          position: "absolute",
                          top: "-15px",
                          right: "-10px",
                          cursor: "pointer",
                          zIndex: 1,
                          padding: 4,
                          backgroundColor: CSSDefaults.headerFontColor,
                          borderRadius: "50%",
                          color: CSSDefaults.headerBgColor,
                          fontSize: "1.2rem",
                        }}
                      />
                      {file.type.startsWith("image/") ? (
                        <CardMedia
                          component="img"
                          image={URL.createObjectURL(file)}
                          alt={`Thumbnail ${file.name}`}
                          style={{ objectFit: "cover", width: "100%" }}
                        />
                      ) : file.type === "application/pdf" ? (
                        <div
                          style={{
                            alignItems: "center",
                            backgroundColor: "rgba(0,0,0,.05)",
                            display: "flex",
                            justifyContent: "center",
                            height: "50px",
                            textAlign: "center",
                          }}
                        >
                          <PictureAsPdfOutlinedIcon
                            sx={{ fontSize: 40 }}
                            style={{ opacity: ".54" }}
                          />
                        </div>
                      ) : (
                        <div
                          style={{
                            alignItems: "center",
                            backgroundColor: "rgba(0,0,0,.05)",
                            display: "flex",
                            justifyContent: "center",
                            height: "50px",
                            textAlign: "center",
                          }}
                        >
                          <ArticleOutlinedIcon
                            sx={{ fontSize: 40 }}
                            style={{ opacity: ".54" }}
                          />
                        </div>
                      )}
                      {getFileNameTextContent(file.name)}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        )}

        <FormControl fullWidth style={{ marginTop: "15px" }}>
          <Typography variant="h6" gutterBottom>
            Attachment Type
          </Typography>
          <Select
            labelId="attachment-type-label"
            value={attachmentValue.attachmentType}
            onChange={handleAttachmentTypeChange}
          >
            <MenuItem value="0">Select Attachment Type</MenuItem>
            {attachmentTypes.map((at) => (
              <MenuItem key={at.id} value={at.id}>
                {at.attachType}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      {/* </form> */}
    </Box>
  );
};

export default AttachmentsUploader;
