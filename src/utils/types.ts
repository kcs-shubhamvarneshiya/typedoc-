/**
 * This class definition creates a type called `LoaderProps` which has one property `isLoading` of boolean type.
  `isLoading:` Represents whether the loader is currently in a loading state.
 */
export type LoaderProps = {
  isLoading: boolean;
};

/**
 * This class definition creates a type called ToastTypeProps that has three properties: open, message, and type.
  `open:` Represents the time the toast was opened.
  `message:` Contains the text message to display in the toast.
  `type:` Specifies the type of toast, such as success, error, warning, etc.
 */
export type ToastTypeProps = {
  open: number | Date;
  message: string;
  type: string;
};

/**
 * This TypeScript class definition defines a type called Search with optional properties for filtering search criteria.

    `ApplicationName:` Represents the name of the application.
    `search:` Represents the search query string.
    `fromDate:` Represents the starting date for search.
    `toDate:` Represents the ending date for search.
    `status:` Represents the status of the search.
    `currency:` Represents the currency for the search.
    `application:` Represents the application for the search.
 */
export type Search = {
  ApplicationName?: string;
  search?: string;
  fromDate?: string;
  toDate?: string;
  status?: string;
  currency?: string;
  application?: string;
};

/**
 * This class definition creates a type `SideBarProps` with a property `onActiveMenuChange` of type any.
 * `onActiveMenuChange:` Represents a function that will be called when the active menu in the sidebar changes.
 */
export type SideBarProps = {
  onActiveMenuChange: any;
};

/** 
* This class definition creates a type called `TransactionsType`.
`id:` Represents the transaction ID.
`transactionId:` Represents the ID of the transaction.
`account:` Represents the account associated with the transaction.
`transactionDate:` Represents the date of the transaction.
`applicationName:` Represents the name of the application.
`currency:` Represents the currency of the transaction.
`transactionAmount:` Represents the amount of the transaction.
`userId:` Represents the user ID associated with the transaction.
`transactionStatus:` Represents the status of the transaction.
`cardType:` Represents the type of card used for the transaction.
`referenceCode:` Represents a reference code associated with the transaction.
`merchant:` Represents the merchant involved in the transaction. 
*/
export type TransactionsType = {
  id?: string;
  transactionId?: string;
  account?: null;
  transactionDate?: null;
  applicationName?: null;
  currency?: string;
  transactionAmount?: string;
  userId?: null;
  transactionStatus?: string;
  cardType?: string;
  referenceCode?: string;
  merchant?: string;
};

/**
 * This class definition creates a type called PaginationInfo with three properties: pageIndex, pageSize, and totalRecords.
 * `pageIndex:` Represents the index of the current page.
 * `pageSize:` Represents the number of items per page.
 * `totalRecords:` Represents the total number of records.
 */
type PaginationInfo = {
  pageIndex: number;
  pageSize: number;
  totalRecords: number;
};

type TransactionData = {
  paginationInfo: PaginationInfo;
  records: TransactionsType[] | RefundTransactions[];
};

/**
 * This class definition creates a type called `TransactionsResponse` that includes the following properties:
 * `data:` Contains transaction data.
 * `errors:` Can hold any errors.
 * `isSuccess:` Indicates if the operation was successful.
 * `message:` Stores a message related to the transaction response.
 */
export type TransactionsResponse = {
  data: TransactionData;
  errors: any;
  isSuccess: boolean;
  message: string;
};

/**
 * This class definition creates a type `RefundTransactions` that extends `TransactionsType` by omitting specific properties and adding optional properties reconciliationId, amount, status, and refundDate.
 * `reconciliationId?`: string; - Optional property for reconciliation ID.
 * `amount?`: `string`; - Optional property for amount.
 * `status?`: `string`; - Optional property for status.
 * `refundDate?`: `string`; - Optional property for refund date.
 */
export type RefundTransactions = Omit<
  TransactionsType,
  | "account"
  | "transactionDate"
  | "transactionAmount"
  | "transactionStatus"
  | "cardType"
> & {
  reconciliationId?: string;
  amount?: string;
  status?: string;
  refundDate?: string;
};

/**
 * This TypeScript code defines a type `MerchantTypes` which is an object with two properties: `label` and `value`. 
 * Both properties are of type `string`.
 */
export type MerchantTypes = {
  label: string;
  value: string;
};

export type TransactionGraphData = {
  type: string;
  month: string;
  year: string;
  status: string;
  recordCount: string;
};

export type BarSeriesType = {
  name: string;
  data: Array<number>;
};

export type paymentTransactionDetails = {
  id: number;
  paymentInstrumentId: string;
  customerTokenId: string;
  cardLast4Digits: string;
  referenceInformationCode: string;
  isCapture: boolean;
  totalAmount: number;
  currency: string;
  merchantRef: string;
  ignoreAvsResult: string;
  declineAvsCodes: string;
  applicationName: string;
  paymentCaptureId: string;
  terminalId: string;
  processorApprovalCode: string;
  networkTransactionId: string;
  processorResponseCode: string;
  processorTransactionId: string;
  avsCode: string;
  avsCodeRaw: string;
  errorReason: string;
  errorMessage: string;
  responseInsightsCategory: string;
  responseInsightsCategoryCode: string;
  reconciliationId: string;
  paymentCaptureStatus: string;
  paymentSubmitTime: string;
  cardType: string;
  userId: string;
  account: string;
};

export type refundPaymentTransactionDetails = paymentTransactionDetails & {
  refundAmount?: number;
  refundCurrency?: string;
  refundStatus?: string;
  requestedAmount?: number;
  refundSubmitTime?: string;
  transactionId?: string;
  errorDetail?: string;
};
export type billTo = {
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  locality: string;
  postalCode: string;
  country: string;
  email: string;
  administrativeArea: string;
  phoneNumber: string;
};

export type card = {
  number: string;
  expirationMonth: number;
  expirationYear: number;
  type: string;
  cardState: string;
};
export type customerDetails = {
  id: string;
  instrumentObject: string;
  state: string;
  accountNumber: string;
  card: card;
  billTo: billTo;
  creator: string;
};

export type TransactionMaster = {
  paymentTransactionDetails: paymentTransactionDetails;
  customerDetails: customerDetails;
};

export type RefundedTransactionMaster = {
  refundPaymentTransactionDetails: refundPaymentTransactionDetails;
  customerDetails: customerDetails;
};

export type Transaction = {
  data: TransactionMaster;
  errors: any;
  isSuccess: boolean;
  message: string;
};

export type RefundTransaction = Transaction & {
  data: RefundedTransactionMaster;
};

export type SecurityKey = {
  id: number;
  application: string;
  publicKey?: string;
  remarks?: string;
  createdBy?: string;
  createdOn?: string;
  updatedOn?: string;
  updatedBy?: string;
  isActive?: boolean;
};

export type SecurityKeyBody = {
  application: number;
  remarks: string;
};

export type SecurityKeyResponse = {
  data: SecurityKey[];
  errors: any;
  isSuccess: boolean;
  message: string;
};

export enum ApplicationType {
  CCDB = 1,
  JDE,
}

export enum UserRole {
  ADMIN = 1,
  USER,
}
