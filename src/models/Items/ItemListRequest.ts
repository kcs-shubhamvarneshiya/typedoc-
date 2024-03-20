import { GridSortDirection } from "@mui/x-data-grid";
import { SortDirection } from "../Enum";

export type SelectedFilters = {
  projectCode?: number | null;
  stockCode?: string | null;
  baseCode?: string | null;
  pdCode?: string | null;
  family?: string | null;
  pdFamily?: string | null;
  stage?: number | null;
  status?: number | null;
  factoryStatus?: string | null;
  supplier?: number | null;
  priority?: number | null;
  royaltyDesigner?: number | null;
  marketingDesigner?: number | null;
  category?: number | null;
  function?: number | null;
  introDate?: string | null;
  primaryFinishCD?: string | null;
  primaryFinishDescription?: string | null;
  secondaryFinishCD?: string | null;
  secondaryFinishDescription?: string | null;
  primaryMaterial?: string | null;
  secondaryMaterial?: string | null;
  brand?: number | null;
};

export type ItemListRequest = SelectedFilters & {
  pageIndex: number;
  pageSize: number;
  sortBy: string;
  sortDirection: SortDirection;
};
