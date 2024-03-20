import { Routes, Route, useNavigate } from "react-router-dom";

import Home from "./pages/Home";
import "./styles/globals.scss";
import PageNotFound from "./pages/404";
import { useEffect, useState } from "react";
import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import Loader from "./components/Loader";
import { PageLayout } from "./components/Layout";
import Login from "./pages/Login";
import { IPublicClientApplication } from "@azure/msal-browser";
import SessionService from "./services/SessionService";
import AADLoginResponse from "./pages/AADLoginResponse";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "./services/ApiService";
import RolesList from "./pages/Roles/index";
import ProductList from "./pages/Products/ProductList";
import UserList from "./pages/Users";
import ProjectStageSetting from "./pages/ApplicationSetting/Project-Stage-Setting/ProjectStageSettingIndex";
import AttachmentTest from "./pages/attachment-test";
import ProjectStatusSetting from "./components/ManageSettingComponents/ProjectStatus-Setting";
import FactoryStatusSetting from "./components/ManageSettingComponents/FactoryStatus-Setting";
import ProjectCoordinatorSetting from "./components/ManageSettingComponents/ProjectCoordinator-Setting";
import AttachmentTypeSetting from "./components/ManageSettingComponents/AttachmentType-Setting";
import MarketingDesignerSetting from "./components/ManageSettingComponents/MarketingDesigner-Setting";
import RoyaltyDesignerSetting from "./components/ManageSettingComponents/RoyaltyDesigner-Setting";
import SupplierSetting from "./components/ManageSettingComponents/Suppliers-Setting";
import ProductFinishSetting from "./components/ManageSettingComponents/ProductFinish-Setting";
import PrimaryMaterialSetting from "./pages/ApplicationSetting/PrimaryMaterialSetting/PrimaryMaterialSetting";
import HTSMaterialSetting from "./pages/ApplicationSetting/HTSMaterialSetting/HTSMaterialSetting";
import HTSDetailSetting from "./pages/ApplicationSetting/HTSMaterialDetailSetting/HTSDetailSetting";
import StockCodeHierarchySetting from "./pages/ApplicationSetting/StockCodeHierarchySetting/StockCodeHierarchySetting";
import BaseCodeHierarchySetting from "./pages/ApplicationSetting/BasecodeHierarchySetting/BasecodeHierarchySetting";
import CategorySetting from "./pages/ApplicationSetting/CategorySetting/CategorySetting";
import DataTypeSetting from "./components/ManageSettingComponents/DataType-Setting";
import ProjectStageStatusSetting from "./components/ManageSettingComponents/ProjectStageStatus-Setting";
import CreateProduct from "./pages/Products/CreateProduct";
import ManufactoryMethodSetting from "./pages/ApplicationSetting/ManufacturingMethodSetting/ManufacturingMethodSetting";
import BulkUpload from "./pages/Products/BulkUpload";
import BulkUpdate from "./pages/Products/BulkUpdate";
import SecondaryMaterialSetting from "./pages/ApplicationSetting/SecondaryMaterialSetting/SecondaryMaterialSetting";

function App() {
  const sessionService = SessionService.getInstance();
  const [loader, setLoader] = useState(false);
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionService.isLoggedIn()
  );
  const navigate = useNavigate();

  useEffect(() => {
    setIsAuthenticated(sessionService.isLoggedIn());
  }, [sessionService]);

  useEffect(() => {
    api.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        setLoader(true);
        if (
          config.url &&
          !config.url.includes(process.env.REACT_APP_API_URL as string)
        ) {
          config.url = process.env.REACT_APP_API_URL + config.url;
        }

        const sessionInfo: any = JSON.parse(
          window?.localStorage.getItem("session") || "{}"
        );
        const key = process.env.REACT_APP_API_KEY;
        if (key) {
          config.headers["x-api-key"] = key;
        }

        if (sessionInfo.token) {
          config.headers.Authorization = `Bearer ${sessionInfo.token}`;
        }

        return config;
      },
      (err: any) => {
        setLoader(false);
        return Promise.reject(err);
      }
    );

    api.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        setLoader(false);
        return response;
      },
      async (err: any) => {
        const defaultMessage =
          "Error response received from server. Please try again after refreshing your page";
        const originalRequest = err.config;
        setLoader(false);
        if (err?.response?.status && err?.response?.status === 401) {
          navigate("/login");
          return Promise.reject(err);
        } else if (err?.response?.status === 404) {
          let customErrorValidation = "";
          if (err?.response?.data?.startsWith("Validation failed:")) {
            customErrorValidation = err?.response?.data
              ?.split(": ")[2]
              ?.split(" Severity")[0];
          } else if (!err?.response?.data?.startsWith("Validation failed:")) {
            customErrorValidation = err?.response?.data;
          } else {
            customErrorValidation = "";
          }
          toast.error(
            customErrorValidation ||
              err.message ||
              "Could not find the requested resource"
          );
        } else if (err?.response?.status === 400) {
          let customErrorValidation = "";
          if (err?.response?.data?.startsWith("Validation failed:")) {
            customErrorValidation = err?.response?.data
              ?.split(": ")[2]
              ?.split(" Severity")[0];
          } else if (!err?.response?.data?.startsWith("Validation failed:")) {
            customErrorValidation = err?.response?.data;
          } else {
            customErrorValidation = "";
          }

          toast.error(customErrorValidation || err.message || defaultMessage);
        } else {
          toast.error(defaultMessage);
        }

        setLoader(false);
        return Promise.resolve();
      }
    );
  }, [api.axiosInstance]);

  return (
    <>
      <ToastContainer />
      {isAuthenticated && (
        <PageLayout>
          <ProtectedPages />
        </PageLayout>
      )}
      {!isAuthenticated && <UnAuthenticationPages />}
      {loader && <Loader isLoading={loader} />}
    </>
  );
}

function ProtectedPages() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/roles" element={<RolesList />} />
      <Route path="/users" element={<UserList />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/create-product" element={<CreateProduct />} />
      <Route path="/bulk-update" element={<BulkUpdate />} />
      <Route path="/bulk-create" element={<BulkUpload />} />
      <Route path="/attachment-test" element={<AttachmentTest />} />
      <Route path="/project-stage" element={<ProjectStageSetting />} />
      <Route path="/project-status" element={<ProjectStatusSetting />} />
      <Route
        path="/project-stage-status"
        element={<ProjectStageStatusSetting />}
      />
      <Route path="/factory-status" element={<FactoryStatusSetting />} />
      <Route
        path="/project-coordinator"
        element={<ProjectCoordinatorSetting />}
      />
      <Route path="/attachment-type" element={<AttachmentTypeSetting />} />
      <Route path="/royalty-designer" element={<RoyaltyDesignerSetting />} />
      <Route
        path="/marketing-designer"
        element={<MarketingDesignerSetting />}
      />
      <Route path="/suppliers" element={<SupplierSetting />} />
      <Route path="/product-finish" element={<ProductFinishSetting />} />
      <Route path="/primary-material" element={<PrimaryMaterialSetting />} />
      <Route
        path="/secondary-material"
        element={<SecondaryMaterialSetting />}
      />
      <Route path="/hts-material" element={<HTSMaterialSetting />} />
      <Route path="/hts-material-detail" element={<HTSDetailSetting />} />
      <Route
        path="/stockcode-image-hierarchy"
        element={<StockCodeHierarchySetting />}
      />
      <Route
        path="/basecode-image-hierarchy"
        element={<BaseCodeHierarchySetting />}
      />
      <Route path="/category-(and-sort-order)" element={<CategorySetting />} />
      <Route path="/data-type" element={<DataTypeSetting />} />
      <Route
        path="/manufacturing-method"
        element={<ManufactoryMethodSetting />}
      />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

function UnAuthenticationPages() {
  return (
    <Routes>
      <Route path="/aad-login-response" element={<AADLoginResponse />} />
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;
