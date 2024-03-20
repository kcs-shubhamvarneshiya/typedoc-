import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Box from "@mui/material/Box";
import {
  Button,
  Card,
  CardContent,
  FormControl,
  TextField,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { ApiResponse } from "../../models/ApiResponse";
import {
  ProductFilterOptions,
  PickListFilterResponse,
} from "../../models/Items/FilterOptions";
import api from "../../services/ApiService";
import { CreateItemRequest } from "../../models/Items/Item";
import AttachmentsUploader from "../../components/AttachmentsUploader";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { DATE_FORMAT } from "../../utils/constants";

/**
 * Creates a new product item with various fields such as createDate, stockcode, brand, shortDesc, familyName, baseCode, baseCode_MKT, pdCode, introdate, priority, stage, status, status_Factory, marketingDesigner, royaltyDesigner, category, function, style, skuType, slType, primaryFinishId, supplier, coordinator, and drawingNum. It also handles the submission of the created item and attachment uploads.
 *
 * @param {type} paramName - description of parameter
 * @return {type} description of return value
 */
const CreateProduct = () => {
  const [attachments, setAttachments] = useState({
    files: [],
    attachmentType: 0,
  });
  const [filterOptions, setFilterOptions] = useState<ProductFilterOptions>({});
  const [selectedDropDownOptions, setSelectedDropDownOptions] = useState<any>(
    {}
  );
  const handleAttachChange = (newAttachments: any) => {
    const files = newAttachments.files;
    const attachmentType = newAttachments.attachmentType;
    if ((files && files.length > 0) || attachmentType) {
      setAttachments({ files: files, attachmentType: attachmentType });
    }
  };

  let navigate = useNavigate();
  // these fields stores the reference id and not the actual value e.g. Stage, Category
  const REFERENCE_FIELDS = [
    "stage",
    "status",
    "supplier",
    "priority",
    "royaltyDesigner",
    "marketingDesigner",
    "category",
    "function",
    "brand",
    "style",
    "skuType",
    "coordinator",
    "slType",
    "primaryFinishId",
  ];

  useEffect(() => {
    getAllFilterOptions();
  }, []);

  const getAllFilterOptions = async () => {
    try {
      const filterOptionsApiResponse = await api.get<
        ApiResponse<ProductFilterOptions>
      >(`/Item/filter-options`);

      const styleResponse = api
        .get<ApiResponse<PickListFilterResponse>>(`/PickList/styles`)
        .then((response) => {
          if (response.isSuccess) {
            return response;
          } else {
            throw new Error(response.message);
          }
        })
        .catch((error) => {
          console.log("Exception from styles", error);
        });

      const skuResponse = api
        .get<ApiResponse<PickListFilterResponse>>(`/PickList/sku-types`)
        .then((response) => {
          if (response.isSuccess) {
            return response;
          } else {
            throw new Error(response.message);
          }
        })
        .catch((error) => {
          console.log("Exception from sku-types", error);
        });

      const slTypesResponse = api
        .get<ApiResponse<PickListFilterResponse>>(`/PickList/sl-types`)
        .then((response) => {
          if (response.isSuccess) {
            return response;
          } else {
            throw new Error(response.message);
          }
        })
        .catch((error) => {
          console.log("Exception from sl-types", error);
        });

      const coordinatorsResponse = api
        .get<ApiResponse<PickListFilterResponse>>(`/PickList/coordinators`)
        .then((response) => {
          if (response.isSuccess) {
            return response;
          } else {
            throw new Error(response.message);
          }
        })
        .catch((error) => {
          console.log("Exception from coordinators", error);
        });

      const apiCalls = [
        styleResponse,
        skuResponse,
        slTypesResponse,
        coordinatorsResponse,
      ];

      const responses = await Promise.all(apiCalls);

      const combinedData = responses.reduce((acc, response: any, index) => {
        const responseMessageName: string = response.message
          ? response.message.split(" ")[0].toLowerCase()
          : `data${index}`;
        let setKeyName: string;
        switch (responseMessageName) {
          case "styles":
            setKeyName = "style";
            break;
          case "sku":
            setKeyName = "skuType";
            break;
          case "sale":
            setKeyName = "sLType";
            break;
          case "coordinators":
            setKeyName = "coordinator";
            break;
          default:
            setKeyName = "defaultData";
            break;
        }
        acc[setKeyName] = response.isSuccess ? response.data : null;
        return acc;
      }, filterOptionsApiResponse.data || {});

      filterOptionsApiResponse.data = combinedData;
      if (filterOptionsApiResponse.isSuccess) {
        setFilterOptions(filterOptionsApiResponse.data);
      } else {
        throw new Error(filterOptionsApiResponse.message);
      }
    } catch (error) {
      console.error("Exception from API", error);
    }
  };

  const handleDropDownOptionsChange = (fieldName, selectedItem) => {
    if (!selectedItem) {
      formik.setFieldValue(fieldName, undefined);
      setSelectedDropDownOptions({
        ...selectedDropDownOptions,
        [fieldName]: undefined,
      });
    } else {
      const selectedValue =
        typeof selectedItem === "string"
          ? selectedItem
          : REFERENCE_FIELDS.includes(fieldName)
          ? selectedItem.id
          : selectedItem.name;
      formik.setFieldValue(fieldName, selectedValue);
      setSelectedDropDownOptions({
        ...selectedDropDownOptions,
        [fieldName]: selectedItem,
      });
    }
  };

  const renderAutocomplete = (
    fieldName,
    label,
    optionList: Array<any> | undefined
  ) => (
    <FormControl style={{ margin: "5px 5px", width: "32%" }}>
      <label htmlFor={`outlined-${label}`}>{label}</label>
      <Autocomplete
        id={`outlined-${label}`}
        value={
          selectedDropDownOptions[fieldName]
            ? selectedDropDownOptions[fieldName]
            : null
        }
        onChange={(event, newValue) =>
          handleDropDownOptionsChange(fieldName, newValue)
        }
        onBlur={formik.handleBlur}
        options={optionList ? optionList : []}
        getOptionLabel={(option) => option.name || option.description || option}
        renderInput={(params) => (
          <TextField
            error={
              formik.touched[fieldName] && Boolean(formik.errors[fieldName])
            }
            key={params.id}
            {...params}
            placeholder="- Select -"
          />
        )}
      />
    </FormControl>
  );
  const renderTextField = (fieldName, label) => (
    <FormControl style={{ margin: "5px 5px", width: "32%" }}>
      <label htmlFor={`outlined-${label}`}>{label}</label>
      <TextField
        id={`outlined-${label}`}
        value={formik.values[fieldName]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        name={fieldName}
        error={formik.touched[fieldName] && Boolean(formik.errors[fieldName])}
      />
    </FormControl>
  );

  const initialValues: CreateItemRequest = {
    createDate: new Date(),
    stockcode: "",
    brand: null,
    shortDesc: "",
    familyName: "",
    baseCode: "",
    baseCode_MKT: "",
    pdCode: "",
    introdate: null,
    priority: null,
    // twp: "",
    stage: null,
    status: null,
    status_Factory: "",
    marketingDesigner: null,
    royaltyDesigner: null,
    category: null,
    function: null,
    style: null,
    skuType: null,
    slType: null,
    primaryFinishId: null,
    supplier: null,
    coordinator: null,
    drawingNum: "",
  };
  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object().shape({
      createDate: Yup.date().required("Date is required"),
      brand: Yup.string().nullable().required("Brand is required"),
      shortDesc: Yup.string()
        .required("Short Description is required")
        .min(1, "Short Description must be at least 1 characters")
        .max(40, "Short Descriptione must be at most 40 characters"),
    }),
    onSubmit: async (values) => {
      const data = {
        ...values,
        createDate: moment(values.createDate).format(DATE_FORMAT),
        introdate: values.introdate
          ? moment(values.introdate).format(DATE_FORMAT)
          : null,
      };

      const attachmentType = attachments?.attachmentType;
      const files = attachments?.files;

      if (attachmentType || files.length > 0) {
        if (
          files.length > 0 &&
          typeof attachmentType === "number" &&
          attachmentType !== 0
        ) {
          try {
            const response = await api.post<ApiResponse<CreateItemRequest>>(
              "/Item",
              data
            );

            if (!files.length) {
              toast.error(
                files.length > 0
                  ? "Select attachment type!"
                  : "Please upload file!"
              );
              return;
            }

            const itemId = response.data;
            const formData = new FormData();

            for (const file of files) {
              formData.append("files", file);
            }

            formData.append("ItemId", `${itemId}`);
            formData.append("AttachType", `${attachmentType}`);
            const attachmentResponse = await api.post<ApiResponse<any>>(
              "/Attachment/add",
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );

            if (attachmentResponse.isSuccess) {
              toast.success(attachmentResponse.message);
              navigate("/products");
            } else {
              throw new Error(attachmentResponse.message);
            }
          } catch (error: any) {
            toast.error(error.message);
          }
        } else if (files.length > 0) {
          toast.error("Select attachment type!");
        } else {
          toast.error("Please upload file!");
        }
      } else {
        try {
          const response = await api.post<ApiResponse<CreateItemRequest>>(
            "/Item",
            data
          );
          if (response.isSuccess) {
            toast.success(response.message);
            navigate("/products");
          } else {
            throw new Error(response.message);
          }
        } catch (error: any) {
          toast.error(error.message);
        }
      }
    },
  });

  return (
    <>
      <Card sx={{ marginBottom: 1 }}>
        <CardContent>
          <p>Create New Item</p>
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            <form onSubmit={formik.handleSubmit}>
              <FormControl style={{ margin: "5px 5px", width: "32%" }}>
                <label htmlFor="outlined-createDate">Create Date</label>
                <TextField
                  id="outlined-createDate"
                  type="date"
                  value={moment(formik.values.createDate).format("YYYY-MM-DD")}
                  onChange={(e) =>
                    formik.setFieldValue(
                      "createDate",
                      moment(e.target.value, "YYYY-MM-DD").toDate()
                    )
                  }
                  onBlur={formik.handleBlur}
                  name="createDate"
                  error={
                    formik.touched.createDate &&
                    Boolean(formik.errors.createDate)
                  }
                />
              </FormControl>
              {renderTextField("stockcode", "Stockcode")}
              {renderAutocomplete("brand", "Brand", filterOptions.brands)}
              {renderTextField("shortDesc", "Short Description")}
              {renderTextField("familyName", "Family Name / PDF")}
              {renderTextField("baseCode", "Basecode")}
              {renderTextField("baseCode_MKT", "Basecode MKT")}
              {renderTextField("pdCode", "PD Code")}
              <FormControl style={{ margin: "5px 5px", width: "32%" }}>
                <label htmlFor="outlined-introdate">Intro Date</label>
                <TextField
                  type="date"
                  value={moment(formik.values.introdate).format("YYYY-MM-DD")}
                  onChange={(e) =>
                    formik.setFieldValue(
                      "introdate",
                      moment(e.target.value, "YYYY-MM-DD").toDate()
                    )
                  }
                  onBlur={formik.handleBlur}
                  name="introdate"
                />
              </FormControl>
              {renderAutocomplete(
                "priority",
                "Priority",
                filterOptions.productPriorities
              )}
              <FormControl style={{ margin: "5px 5px", width: "32%" }}>
                <label htmlFor="outlined-twp">Target Wholesale Price</label>
                <TextField
                  id="outlined-twp"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="twp"
                />
              </FormControl>
              {renderAutocomplete(
                "stage",
                "Stage",
                filterOptions.projectStages
              )}
              {renderAutocomplete(
                "status",
                "Status",
                filterOptions.projectStatuses
              )}
              {renderAutocomplete(
                "status_Factory",
                "Factory Status",
                filterOptions.productFactoryStatuses
              )}
              {renderAutocomplete(
                "marketingDesigner",
                "Marketing Designer",
                filterOptions.productDesignerMkts
              )}
              {renderAutocomplete(
                "royaltyDesigner",
                "Royalty Designer",
                filterOptions.productDesignerRyts
              )}
              {renderAutocomplete(
                "category",
                "Category",
                filterOptions.productcategories
              )}
              {renderAutocomplete(
                "function",
                "Function",
                filterOptions.productFunctions
              )}
              {renderAutocomplete("style", "Style", filterOptions.style)}
              {renderAutocomplete("skuType", "SKU", filterOptions.skuType)}
              {renderAutocomplete(
                "slType",
                "Selling Line Type",
                filterOptions.sLType
              )}
              {renderAutocomplete(
                "primaryFinishId",
                "Primary Finish",
                filterOptions.fixtureFinishes
              )}
              {renderAutocomplete(
                "supplier",
                "Suppliers",
                filterOptions.productSuppliers
              )}
              {renderAutocomplete(
                "coordinator",
                "Coordinator",
                filterOptions.coordinator
              )}
              {renderAutocomplete(
                "drawingNum",
                "Drawing #",
                filterOptions.productFunctions
              )}

              <AttachmentsUploader
                title="Upload pdf, doc, docx, jpg, jpeg, png"
                onChange={handleAttachChange}
              />

              <Button
                type="submit"
                variant="contained"
                style={{ margin: "8px 5px" }}
              >
                Submit
              </Button>
            </form>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default CreateProduct;
