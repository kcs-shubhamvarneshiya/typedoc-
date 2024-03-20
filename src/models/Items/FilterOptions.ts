export type ProductFilterOptions = {
  stockCodes?: string[];
  baseCodes?: string[];
  pdCodes?: string[];
  familyNames?: string[];
  pdFamilyNames?: string[];
  projectStages?: KeyValues[];
  projectStatuses?: KeyValues[];
  productFactoryStatuses?: KeyValues[];
  productcategories?: KeyValues[];
  productFunctions?: KeyValues[];
  productSuppliers?: KeyValues[];
  productPriorities?: number[];
  productDesignerMkts?: KeyValues[];
  productDesignerRyts?: KeyValues[];
  productIntroDatess?: Date[];
  fixtureFinishes?: KeyValuesWithCode[];
  brands?: KeyValues[];
  primaryMaterials?: KeyValuesWithCode[];
  secondaryMaterials?: KeyValuesWithCode[];
  style?: KeyValues[];
  coordinator?: KeyValues[];
  skuType?: KeyValues[];
  sLType?: KeyValues[];
  attachment?: KeyValuesWithCode[];
  projectCode?: string;
};

/**
 *    This class definition creates a type called `PickListFilterResponse` with three properties: `data`, `isSuccess`, and `message.PickListFilterResponse` with three properties: `data`, `isSuccess`, and `message`.
 * ```data: an empty array
 *    isSuccess: a boolean indicating the success status
 *    message: a string containing a message```
 */
export type PickListFilterResponse = {
  data: [];
  isSuccess: boolean;
  message: string;
};

/**
 * This TypeScript code defines a type KeyValues with three properties: id of type `number`, `name` of type `string`, and `description` of type `string`. It's used to enforce a specific structure for objects that have these properties.
 */
export type KeyValues = {
  id: number;
  name: string;
  description: string;
};

/**
 * This class definition creates a type named KeyValuesWithCode with the following properties:
 * ```id: a number
 * name: a string
 * code: a string
 * attachType: a string
 * description: a string```
 */
export type KeyValuesWithCode = {
  id: number;
  name: string;
  code: string;
  attachType: string;
  description: string;
};
