/**
 * This class definition is a TypeScript type alias for an API response object.
 * `isSuccess`: Indicates if the API call was successful.
 * `message`: Contains a message related to the API call.
 * `data`: Holds the actual data returned by the API call.
 */
export type ApiResponse<T> = {
    [x: string]: any;
    isSuccess: boolean;
    message: string;
    data: T;    
}