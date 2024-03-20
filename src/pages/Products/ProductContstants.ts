import { GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import { DATE_FORMAT } from "../../utils/constants";

// mapping used to find original column name that should be used e.g. for sortBy parameter
export const ProductListReferenceColumnsMapping = {
  brandDisplayText: "brand",
  stageDisplayText: "stage",
  statusDisplayText: "status",
  royaltyDesignerDisplayText: "royaltyDesigner",
  marketingDesignerDisplayText: "marketingDesigner",
  categoryDisplayText: "category",
  functionDisplayText: "function",
  styleDisplayText: "style",
  supplierDisplayText: "supplier",
  skuTypeDisplayText: "skuType",
  slTypeDisplayText: "slType",
  primaryFinishCd: "primaryFinishId",
  secondaryFinishCd: "secondaryFinishId",
};

export const ProductListGridColumns: GridColDef[] = [
  { field: "id", headerName: "Id", width: 65, disableColumnMenu: true },
  {
    field: "stockcode",
    headerName: "Stock Code",
    sortable: true,
    disableColumnMenu: true,
  },
  {
    field: "pdStockcode",
    headerName: "PDStock Code",
    sortable: true,
    disableColumnMenu: true,
  },
  {
    field: "baseCode",
    headerName: "Base Code",
    sortable: true,
    disableColumnMenu: true,
  },
  {
    field: "pdCode",
    headerName: "PDCode",
    sortable: true,
    disableColumnMenu: true,
  },
  {
    field: "brandDisplayText",
    headerName: "Brand",
    sortable: true,
    disableColumnMenu: true,
  },  
  {
    field: "shortDesc",
    headerName: "Short Desc",
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: "stageDisplayText",
    headerName: "Stage",
    sortable: true,
    disableColumnMenu: true,
  },
  {
    field: "statusDisplayText",
    headerName: "Status",
    sortable: true,
    disableColumnMenu: true,
  },
  {
    field: "pdFamilyName",
    headerName: "PD Family Name",
    sortable: true,
    disableColumnMenu: true,
  },
  {
    field: "familyName",
    headerName: "Family Name",
    sortable: true,
    disableColumnMenu: true,
  },
  {
    field: "relatives",
    headerName: "Relatives",
    sortable: true,
    disableColumnMenu: true,
  },
  {
    field: "royaltyDesignerDisplayText",
    headerName: "Royalty Designer",
    sortable: true,
    disableColumnMenu: true,
  },
  {
    field: "marketingDesignerDisplayText",
    headerName: "Marketing Designer",
    sortable: true,
    disableColumnMenu: true,
  },
  {
    field: "categoryDisplayText",
    headerName: "Category",
    sortable: true,
    disableColumnMenu: true,
  },
  {
    field: "functionDisplayText",
    headerName: "Function",
    sortable: true,
    disableColumnMenu: true,
  },
  {
    field: "department",
    headerName: "Department",
    sortable: true,
    disableColumnMenu: true,
  },
  {
    field: "styleDisplayText",
    headerName: "Style",
    sortable: true,
    disableColumnMenu: true,
  },
  {
    field: "supplierDisplayText",
    headerName: "Supplier",
    sortable: true,
    disableColumnMenu: true,
  },
  {
    field: "skuTypeDisplayText",
    headerName: "SKU Type",
    sortable: true,
    disableColumnMenu: true,
  },
  {
    field: "slTypeDisplayText",
    headerName: "SL Type",
    sortable: true,
    disableColumnMenu: true,
  },
  {
    field: "lampSKU",
    headerName: "Lamp SKU",
    sortable: true,
    disableColumnMenu: true,
  },
  {
    field: "priority",
    headerName: "Priority",
    width: 50,
    sortable: true,
    disableColumnMenu: true,
  },
  {
    field: "primaryFinishCd",
    headerName: "Primary Finish",
    sortable: true,
    disableColumnMenu: true,
    width: 120
  },
  {
    field: "secondaryFinishCd",
    headerName: "Secondary Finish",
    sortable: true,
    disableColumnMenu: true,
    width: 120
  },
  {
    field: "status_Factory",
    headerName: "Factory Status",
    sortable: true,
    disableColumnMenu: true,
    width: 120
  },
  {
    field: "introdate",
    headerName: "Intro Date",
    sortable: true,
    disableColumnMenu: true,
    width: 100,
    valueGetter: (params) => params?.value ? moment(params?.value).format(DATE_FORMAT) : ''
  },
  {
    field: "primaryMaterial",
    headerName: "Primary Material",
    sortable: true,
    disableColumnMenu: true,
  },
  {
    field: "secondaryMaterial",
    headerName: "Secondary Material",
    sortable: true,
    disableColumnMenu: true,
  },
  // {
  //   field: "pdCode",
  //   headerName: "PDCode",
  //   description: "This column has a value getter and is not sortable.",
  //   sortable: false,
  //   width: 160,
  //   valueGetter: (params: GridValueGetterParams) =>
  //     `${params.row.firstName || ""} ${params.row.lastName || ""}`,
  // },
];
