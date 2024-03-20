import { useState, useEffect } from "react";
import {
  DataGrid,
  GridActionsCellItem,
  GridPaginationModel,
  GridRowParams,
  GridSortModel,
  GridToolbar,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import {
  ProductListGridColumns,
  ProductListReferenceColumnsMapping,
} from "./ProductContstants";
import api from "../../services/ApiService";
import { ApiResponse } from "../../models/ApiResponse";
import { ItemBasicDetail } from "../../models/Items/ItemBasicDetail";
import {
  ItemListRequest,
  SelectedFilters,
} from "../../models/Items/ItemListRequest";
import { SortDirection } from "../../models/Enum";
import Filters from "./Filters";
import {
  Button,
  Stack,
  Box,
  CardContent,
  Card,
  CardMedia,
} from "@mui/material";
import Loader from "../../components/Loader";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import ProductAccordian from "./ProductAccordian";
import avatarImage from "../../avatar.jpg";
import RemoveIcon from "@mui/icons-material/Remove";

/**
 * This code snippet is a React component called `ProductList`. 
 * It initializes various states using the `useState` hook to manage loading, item lists, pagination, and filters. 
 * It also includes functions for handling sorting, pagination, and filter application. 
 * The component uses Material-UI components such as `DataGrid`, `GridToolbar`, and `Button` to render a product list with features like editing, filtering, and displaying item details.
 *
 * @return {JSX.Element} The rendered ProductList component.
 */
export default function ProductList() {
  const [isLoading, setLoading] = useState(true);
  const [items, setItems] = useState<ItemBasicDetail[]>([]);
  const [editItem, setEditItem] = useState<ItemBasicDetail[]>([]);

  const [productsTotalCount, setProductsTotalCount] = useState(0);
  const initialItemListRequest = {
    pageIndex: 1,
    pageSize: 10,
    sortBy: "id",
    sortDirection: SortDirection.DESC,
  };

  const [itemListRequest, setItemListRequest] = useState<ItemListRequest>(
    initialItemListRequest
  );

  const actionColumn = {
    field: "actions",
    type: "actions",
    headerName: "Action",
    getActions: (params: GridRowParams) => [
      <GridActionsCellItem
        icon={<EditIcon />}
        onClick={() => handleEditClickOpen(params.id)}
        // onClick={() => handleBoxClick(1)}
        label="Edit"
      />,
    ],
  };

  const gridToolbar = () => (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
      <div style={{ flexGrow: 1, textAlign: "right", padding: 5 }}>
        <GridToolbarQuickFilter />
        <Button variant="contained" sx={{ ml: 5 }}>
          Create Product
        </Button>
      </div>
    </GridToolbarContainer>
  );

  useEffect(() => {
    const getItems = async () => {
      try {
        setLoading(true);
        api
          .post<ApiResponse<ItemBasicDetail[]>>("/item/list", itemListRequest)
          .then((response: any) => {
            setLoading(false);
            if (response.isSuccess) {
              setProductsTotalCount(response?.data?.totalCount);
              setItems(response?.data?.items || []);
            } else {
              throw new Error(response.message);
            }
          })
          .catch((error) => {
            setLoading(false);
            console.log("Exception from item list", error);
          });
      } catch (error: any) {
        setLoading(false);
        console.log("Exception from item list", error);
      }
    };
    getItems();
  }, [api, itemListRequest]);

  // if sorted by a field which is not direct field of item table then find the correct column from mapping
  const getSortFieldName = (gridFieldName: string): string => {
    return ProductListReferenceColumnsMapping[gridFieldName] || gridFieldName;
  };

  // convert state sortBy value to column name that is bound in grid
  const getReverseSortFieldName = (fieldName: string): string => {
    const gridFieldName = Object.keys(ProductListReferenceColumnsMapping).find(
      (prmKey) => ProductListReferenceColumnsMapping[prmKey] === fieldName
    );
    return gridFieldName || fieldName;
  };

  const onSortChange = (sorting: GridSortModel) => {
    setItemListRequest({
      ...itemListRequest,
      sortBy: getSortFieldName(sorting[0].field),
      sortDirection:
        sorting[0].sort === "asc" ? SortDirection.ASC : SortDirection.DESC,
    });
  };

  const onPaginationChange = (pagination: GridPaginationModel) => {
    setItemListRequest({
      ...itemListRequest,
      pageIndex: pagination.page + 1,
      pageSize: pagination.pageSize,
    });
  };

  const handleApplyFilterClick = (filterValues: SelectedFilters) => {
    if (filterValues.projectCode) {
      setItemListRequest({
        ...itemListRequest,
        projectCode: filterValues.projectCode,
      });
    } else if (Object.values(filterValues)?.length) {
      setItemListRequest({
        ...itemListRequest,
        ...filterValues,
      });
    } else {
      //reset the filters
      setItemListRequest(initialItemListRequest);
    }
  };

  /////////////
  const [filtersExpanded, setFiltersExpanded] = useState<boolean>(true);
  const [activeBoxIndex, setActiveBoxIndex] = useState(0);

  const handleEditClickOpen = (itemId) => {
    handleBoxClick(1);

    try {
      api
        .get<ApiResponse<ItemBasicDetail[]>>(`/Item/${itemId}`)
        .then((response: ApiResponse<ItemBasicDetail[]>) => {
          if (response.isSuccess) {
            //  setLoading(false);

            console.log(response?.data);
            setEditItem(response?.data || []);
            //  setUserListData(response.data);
          } else {
            throw new Error(response.message);
          }
        })
        .catch((error) => {
          console.log("Exception from login", error);
        });
    } catch (error: any) {
      console.log(error.message);
    }
  };
  const handleBoxClick = (index) => {
    setActiveBoxIndex(index === activeBoxIndex ? 0 : index);
  };

  const handleExpandClick = () => {
    setFiltersExpanded(!filtersExpanded);
  };

  const columns1 = [
    {
      field: "image",
      headerName: "",
      renderCell: (params) => (
        <img src={params.value} alt="Image" style={{ width: 50, height: 50 }} />
      ),
      width: 50,
      height: 50,
      headerClassName: "aaaaaaaaaaaaaaaaaaaaaaaaaa",
      cellClassName: "bbbbbbbbbbbbbbbbb",
    },
    { field: "lastName", headerName: "" },
    // Add more columns as needed
  ];

  // Define your rows
  const rows1 = [
    { id: 1, lastName: "1234asdf", image: avatarImage, age: 35 },
    { id: 2, lastName: "1234asdf", image: avatarImage, age: 42 },
    { id: 3, lastName: "1234asdf", image: avatarImage, age: 45 },
    { id: 4, lastName: "1234asdf", image: avatarImage, age: 45 },
    { id: 5, lastName: "1234asdf", image: avatarImage, age: 45 },
    { id: 6, lastName: "1234sdd", image: avatarImage, age: 45 },
    { id: 7, lastName: "1234AAA", image: avatarImage, age: 45 },
    { id: 8, lastName: "1234asdf", image: avatarImage, age: 45 },

    // Add more rows as needed
  ];
  return (
    <>
      {activeBoxIndex === 0 ? (
        <Filters
          onApplyFilter={handleApplyFilterClick}
          filtersExpanded={filtersExpanded}
          handleExpandClick={handleExpandClick}
        />
      ) : (
        ""
      )}
      <Loader isLoading={isLoading} />

      <div style={{ display: "flex" }}>
        {activeBoxIndex ? (
          <Box
            sx={{
              height: "70%",
              width: activeBoxIndex === 1 ? "80%" : "0%",
              overflow: "hidden",
              transition: "width 0.5s",
            }}
          >
            <Card sx={{ marginBottom: 1 }}>
              <CardContent>
                <span>{editItem ? editItem["id"] : ""}</span>
                <span style={{ float: "right" }}>
                  <CloseIcon onClick={() => handleBoxClick(1)} />
                </span>
                <ProductAccordian />
              </CardContent>
            </Card>
          </Box>
        ) : (
          ""
        )}

        <Box
          sx={{
            height: "70%",
            width: "20%",
            overflow: "hidden",
            transition: "width 0.5s",
            marginLeft: "auto",
            display: activeBoxIndex === 0 ? "none" : "",
          }}
        >
          <Card sx={{ marginBottom: 1 }}>
            <CardContent className="productView-accordian-rightList">
              <p onClick={() => handleBoxClick(1)}>
                <ArrowBackIcon />
                Back To List
              </p>

              <div className="currentItemName">
                <div className="currentItemTop">
                  <RemoveIcon />
                  <p>
                    Item <span>(51333)</span>
                  </p>
                </div>
                <div className="currentItemBottom">
                  <p> Showing 1 to 100</p>
                </div>
              </div>
              <DataGrid
                rows={rows1}
                columns={columns1}
                // pageSize={5}
                // hideHeader
                disableRowSelectionOnClick={true}
                className="hide-header"
              />
              {/* {items
                ? items.map(
                    (item, index): JSX.Element => (
                      // <div>

                      <Card
                        sx={{ marginBottom: 1 }}
                        key={index}
                        onClick={() => handleBoxClick(1)}
                      >
                        <CardMedia
                          component="img"
                          height="40"
                          image={avatarImage}
                          alt={item.baseCode}
                        />
                        <CardContent>
                          <Typography variant="h5" component="div">
                            {item.id}
                          </Typography>
                        </CardContent>
                      </Card>
                      // </div>
                    )
                  )
                : ""} */}
            </CardContent>
          </Card>
        </Box>
      </div>
      <Box
        sx={{
          height: "70%",
          width: "100%",
          display: activeBoxIndex === 0 ? "block" : "none",
        }}
      >
        <DataGrid
          rows={items}
          columns={[actionColumn, ...ProductListGridColumns]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          rowCount={productsTotalCount}
          pageSizeOptions={[10, 25, 50, 100]}
          disableRowSelectionOnClick={true}
          disableColumnFilter={true}
          sortingMode="server"
          paginationMode="server"
          sortModel={[
            {
              field: getReverseSortFieldName(itemListRequest.sortBy),
              sort:
                itemListRequest.sortDirection == SortDirection.ASC
                  ? "asc"
                  : "desc",
            },
          ]}
          onSortModelChange={onSortChange}
          onPaginationModelChange={onPaginationChange}
          slots={{
            toolbar: gridToolbar,
            noRowsOverlay: () => (
              <Stack
                style={{
                  height: "100px",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <h2>No records found</h2>
              </Stack>
            ),
            noResultsOverlay: () => (
              <Stack
                style={{
                  height: "100px",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <h2>Local search found no records. Please use filters above</h2>
              </Stack>
            ),
          }}
        />
      </Box>
    </>
  );
}

// .productView-accordian-rightList > div.hide-header {
//     padding: 0;
//     border: 0;
// }

// .productView-accordian-rightList > div.hide-header > div {
//     padding: 0 !important;
// }

// .productView-accordian-rightList > div.hide-header > div > div:last-child > div > div {
//     width: 100%;
//     row-gap: 5px;
//     background: transparent;
// }

// .productView-accordian-rightList > div.hide-header > div > div:last-child > div > div > div {
//     background: #fff;
//     border-radius: 4px;
// }

// display: flex;
// align-items: center;
// column-gap: 10px

// .productView-accordian-rightList .currentItemName {
//     display: flex;
//     flex-wrap: wrap;
//     padding: 0;
// }

// .productView-accordian-rightList .currentItemName .currentItemTop {
//     display: inline-flex;
//     align-items: center;
//     column-gap: 5px;
//     padding: 0 !important;
// }

// .productView-accordian-rightList .currentItemName .currentItemTop p {
//     font-size: 18px;
//     font-weight: 800;
//     margin: 0;
// }

// .productView-accordian-rightList .currentItemName .currentItemTop p span {
//     font-weight: 400;
// }

// .productView-accordian-rightList .currentItemName .currentItemBottom {
//     display: inline-flex;
//     align-items: center;
//     column-gap: 5px;
//     padding-left: 30px !important;
// }

// .productView-accordian-rightList .currentItemName .currentItemBottom p {
//     margin: 10px 0;
// }
