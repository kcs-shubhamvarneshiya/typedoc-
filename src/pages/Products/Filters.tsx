import Box from "@mui/material/Box";
import {
  Autocomplete,
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
  TextField,
  Toolbar,
} from "@mui/material";
import { useState, useEffect } from "react";
import { ApiResponse } from "../../models/ApiResponse";
import { toast } from "react-toastify";
import api from "../../services/ApiService";
import { ProductFilterOptions } from "../../models/Items/FilterOptions";
import { SelectedFilters } from "../../models/Items/ItemListRequest";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { DATE_FORMAT } from "../../utils/constants";
import moment from "moment";

/**
 * This code snippet defines a Filters component in React that handles filter options and changes. 
 * It fetches filter options from an API, allows users to select filter values through autocomplete fields, and provides functionality to apply and reset filters. 
 * The component also includes expand/collapse functionality for the filter section.
 *
 * @param {function} onApplyFilter - The function to apply the selected filters
 * @param {boolean} filtersExpanded - A boolean representing whether the filters are expanded or not
 * @param {function} handleExpandClick - The function to handle the expand/collapse action
 * @return {JSX.Element} The Filters component JSX
 * 
 **/
const Filters = ({ onApplyFilter, filtersExpanded, handleExpandClick }) => {
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
    "primaryFinishId",
    "secondaryFinishId",
  ];

  const initialSelectedFilters: SelectedFilters = {};
  // const [filtersExpanded, setFiltersExpanded] = useState<boolean>(true);
  const [filterOptions, setFilterOptions] = useState<ProductFilterOptions>({});
  const [selectedFilterOptions, setSelectedFilterOptions] = useState<any>({});

  // Doesn't store the entier selected option object. Instead stores just the value e.g. name or id
  const [selectedFilterValues, setSelectedFilterValues] =
    useState<SelectedFilters>(initialSelectedFilters);

  useEffect(() => {
    getAllFilterOptions();
  }, []);

  const getAllFilterOptions = async () => {
    try {
      api
        .get<ApiResponse<ProductFilterOptions>>(`/Item/filter-options`)
        .then((response) => {
          if (response.isSuccess) {
            setFilterOptions(response.data);
          } else {
            throw new Error(response.message);
          }
        })
        .catch((error) => {
          console.log("Exception from filter options", error);
        });
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const handleFilterChange = (fieldName, selectedItem) => {
    if (!selectedItem) {
      setSelectedFilterValues({
        ...selectedFilterValues,
        [fieldName]: undefined,
      });
      setSelectedFilterOptions({
        ...selectedFilterOptions,
        [fieldName]: undefined,
      });
    } else {
      const selectedValue =
        typeof selectedItem === "string"
          ? selectedItem
          : REFERENCE_FIELDS.includes(fieldName)
          ? selectedItem.id
          : selectedItem.name;
      setSelectedFilterValues({
        ...selectedFilterValues,
        [fieldName]: selectedValue,
      });

      // store the option itself which could be just a string or {id, name} for assigning to AutoComplet's value property
      setSelectedFilterOptions({
        ...selectedFilterOptions,
        [fieldName]: selectedItem,
      });
    }
  };

  const filterInputStyle = {
    flex: "0 0 calc(20% - 10px)",
    margin: "8px 5px",
    "& .MuiOutlinedInput-root": {
      padding: 0,
      input: {
        paddingBottom: 0,
      },
    },
  };
  const renderAutocomplete = (
    fieldName,
    label,
    optionList: Array<any> | undefined,
    optionLabelGetter: (option) => string = null
  ) => (
    <Autocomplete
      sx={filterInputStyle}
      value={
        selectedFilterOptions[fieldName]
          ? selectedFilterOptions[fieldName]
          : null
      }
      onChange={(event, newValue) => handleFilterChange(fieldName, newValue)}
      options={optionList ? optionList : []}
      getOptionLabel={(option) =>
        optionLabelGetter ? optionLabelGetter(option) : option.name || option
      }
      renderInput={(params) => (
        <TextField
          key={params.id}
          {...params}
          label={label}
          variant="outlined"
        />
      )}
    />
  );

  const handleResetFilterClick = () => {
    setSelectedFilterOptions({});
    setSelectedFilterValues(initialSelectedFilters);
    onApplyFilter({});
  };

  // const handleExpandClick = () => {
  //   setFiltersExpanded(!filtersExpanded);
  // };

  return (
    <Card sx={{ marginBottom: 1 }}>
      <CardActions
        style={{ justifyContent: "space-between", padding: "0 20px" }}
      >
        <span style={{ fontSize: "16px", fontWeight: 700 }}>Filters </span>
        <Button
          onClick={handleExpandClick}
          endIcon={filtersExpanded ? <ExpandLess /> : <ExpandMore />}
        >
          {filtersExpanded ? "Collapse" : "Expand"}
        </Button>
      </CardActions>
      <CardContent style={{ paddingBottom: filtersExpanded ? 2 : 0 }}>
        <Collapse in={filtersExpanded} timeout="auto" unmountOnExit>
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            {renderAutocomplete(
              "stockCode",
              "StockCode",
              filterOptions.stockCodes
            )}
            {renderAutocomplete("family", "Family", filterOptions.familyNames)}
            {renderAutocomplete(
              "status",
              "Status",
              filterOptions.projectStatuses
            )}
            {renderAutocomplete(
              "priority",
              "Priority",
              filterOptions.productPriorities
            )}
            {renderAutocomplete(
              "function",
              "Function",
              filterOptions.productFunctions
            )}
            {renderAutocomplete(
              "primaryFinishId",
              "Primary Finish",
              filterOptions.fixtureFinishes,
              (option) => `${option.code} - ${option.name}`
            )}
            {renderAutocomplete(
              "secondaryFinishId",
              "Secondary Finish",
              filterOptions.fixtureFinishes,
              (option) => `${option.code} - ${option.name}`
            )}
            {renderAutocomplete("brand", "Brand", filterOptions.brands)}
            {renderAutocomplete(
              "baseCode",
              "BaseCode",
              filterOptions.baseCodes
            )}
            {renderAutocomplete(
              "pdFamily",
              "PD Family",
              filterOptions.pdFamilyNames
            )}
            {renderAutocomplete(
              "factoryStatus",
              "Factory Status",
              filterOptions.productFactoryStatuses
            )}
            {renderAutocomplete(
              "royaltyDesigner",
              "Ryt Des",
              filterOptions.productDesignerRyts
            )}
            {renderAutocomplete(
              "marketingDesigner",
              "Mkt Des",
              filterOptions.productDesignerMkts
            )}
            {renderAutocomplete(
              "introDate",
              "Intro Date",
              filterOptions.productIntroDatess,
              (option) => moment(option).format(DATE_FORMAT)
            )}
            {renderAutocomplete(
              "primaryMaterial",
              "Primary Mtl",
              filterOptions.primaryMaterials
            )}
            {renderAutocomplete(
              "secondaryMaterial",
              "Secondary Mtl",
              filterOptions.secondaryMaterials
            )}
            {renderAutocomplete("pdCode", "PD Code", filterOptions.pdCodes)}
            {renderAutocomplete("stage", "Stage", filterOptions.projectStages)}
            {renderAutocomplete(
              "supplier",
              "Supplier",
              filterOptions.productSuppliers
            )}
            {renderAutocomplete(
              "category",
              "Category",
              filterOptions.productcategories
            )}
            <TextField
              sx={filterInputStyle}
              label="Search Project Code"
              variant="outlined"
              value={
                selectedFilterOptions.projectCode
                  ? selectedFilterOptions.projectCode
                  : ""
              }
              onChange={(event) =>
                handleFilterChange("projectCode", event.target.value)
              }
            />
            <Button
              variant="contained"
              style={{ margin: "8px 5px" }}
              onClick={() => onApplyFilter(selectedFilterValues)}
            >
              Search
            </Button>
            <Button
              variant="contained"
              color="warning"
              style={{ margin: "8px 5px" }}
              onClick={handleResetFilterClick}
            >
              Reset
            </Button>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};
export default Filters;
