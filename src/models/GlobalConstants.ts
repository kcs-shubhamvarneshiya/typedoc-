export const CSSDefaults = {
  headerBgColor: "#fff",
  headerFontColor: "#000",
  primaryColor: "#454545",
  lightColor: "rgba(0, 0, 0, 0.04)",
  sideBarActiveMenuBg: "rgba(0, 0, 0, 0.04)",
  sideBarFocusMenuBg: "rgba(0, 0, 0, 0.04)",
};

export const sidebarMenuItems = [
  {
    title: "Dashboard",
    path: "/",
    icon: "Dashboard",
  },
  {
    title: "Product Management",
    icon: "ShoppingCart",
    subMenus: [
      {
        title: "Create New Product",
        path: "/create-product",
      },
      {
        title: "View Products",
        path: "/products",
      },
      {
        title: "Bulk Update",
        path: "/bulk-update",
      },
      {
        title: "Bulk Create",
        path: "/bulk-create",
      },
    ],
  },
  {
    title: "Reports",
    icon: "BarChart",
    subMenus: [
      {
        title: "Report 1",
        path: "/report-1",
      },
    ],
  },
  {
    title: "Users and Roles",
    icon: "People",
    subMenus: [
      {
        title: "Roles",
        path: "/roles",
      },
      {
        title: "Users",
        path: "/users",
      },
    ],
  },
  {
    title: "App Settings",
    icon: "Settings",
    subMenus: [
      {
        title: "Project Stage",
        path: "/project-stage",
      },
      {
        title: "Project Status",
        path: "/project-status",
      },
      {
        title: "Project Stage Status",
        path: "/project-stage-status",
      },
      {
        title: "Factory Status",
        path: "/factory-status",
      },
      {
        title: "Project Coordinator",
        path: "/project-coordinator",
      },
      {
        title: "Attachment Type",
        path: "/attachment-type",
      },
      {
        title: "Royalty Designer",
        path: "/royalty-designer",
      },
      {
        title: "Marketing Designer",
        path: "/marketing-designer",
      },
      {
        title: "Suppliers",
        path: "/suppliers",
      },
      {
        title: "Product Finish",
        path: "/product-finish",
      },
      {
        title: "Primary Material",
        path: "/primary-material",
      },
      {
        title: "Secondary Material",
        path: "/secondary-material",
      },
      {
        title: "HTS Material",
        path: "/hts-material",
      },
      {
        title: "HTS Material Detail",
        path: "/hts-material-detail",
      },
      {
        title: "Stockcode Image Hierarchy",
        path: "/stockcode-image-hierarchy",
      },
      {
        title: "Basecode Image Hierarchy",
        path: "/basecode-image-hierarchy",
      },
      {
        title: "Category (and Sort Order)",
        path: "/category-(and-sort-order)",
      },
      {
        title: "Data Type",
        path: "/data-type",
      },
      {
        title: "Manufacturing Method",
        path: "/manufacturing-method",
      },
    ],
  },
];
