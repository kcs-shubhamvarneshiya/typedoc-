/**
 *  @author Shubham Varneshiya
 * `isOpen`: A boolean property that indicates whether the modal is open or not.
 * `onClose`: A function that is called when the modal is closed.
 * `formik`: An object of type any that represents form data.
 */
export interface CategoryModalProps {
  isOpen: boolean;
  onClose: VoidFunction;
  formik: any;
}

/**
 *  @author Shubham Varneshiya
 * This TypeScript interface defines the props expected by a base code modal component.
 *
 * `isOpen`: boolean flag indicating if the modal is open or closed.
 * `onClose`: function to handle the modal closing.
 * `formik`: a reference to formik for form handling.
 */
export interface BaseCodeModalProps {
  isOpen: boolean;
  onClose: VoidFunction;
  formik;
}

/**
 *  @author Shubham Varneshiya
 * This TypeScript interface `HTSDetailModalProps` defines the shape of an object that must have three properties:
 *`isOpen`: a boolean indicating if the modal is open or not.
 *`onClose`: a function that closes the modal.
 *`formik`: a property that can hold any value.
 */
export interface HTSDetailModalProps {
  isOpen: boolean;
  onClose: VoidFunction;
  formik: any;
}

/**
 *  @author Shubham Varneshiya
 * The `HTSMaterialModalProps` interface defines the props for a material modal.
 * isOpen represents whether the modal is open or closed.
 * onClose is a function that closes the modal.
 * formik is a prop of type any that is used for form handling.
 */
export interface HTSMaterialModalProps {
  isOpen: boolean;
  onClose: VoidFunction;
  formik: any;
}

/**
 *  @author Shubham Varneshiya
 * This TypeScript class definition is an interface named `ManufacturingModalProps`.
 *
 *   `isOpen`: A boolean property to determine if the modal is open or closed.
 *   `onClose`: A function property to handle closing the modal.
 *   `formik`: Any property that can hold form data or functions related to form handling.
 */
export interface ManufacturingModalProps {
  isOpen: boolean;
  onClose: VoidFunction;
  formik: any;
}

/**
 *  @author Shubham Varneshiya
 * This TypeScript interface named `PrimaryMaterialModalProps` defines the shape of props expected by a component.
 *
 *  `isOpen`: Represents whether the modal is open or not.
 *  `onClose`: Function to be called when the modal should be closed.
 *  `formik`: Any type of formik props.
 */
export interface PrimaryMaterialModalProps {
  isOpen: boolean;
  onClose: VoidFunction;
  formik: any;
}

/**
 *  @author Shubham Varneshiya
 * This TypeScript class definition defines the props expected by a secondary material modal component.
    `isOpen`: A boolean indicating if the modal is open or closed.
    `onClose`: A function that closes the modal.
    `formik`: An object containing formik data for the modal.
 */
export interface SecondaryMaterialModalProps {
  isOpen: boolean;
  onClose: VoidFunction;
  formik: any;
}

/**
 *  @author Shubham Varneshiya
 * `isOpen`: A boolean property indicating whether the modal is open or closed.
 * `onClose`: A function that is called when the modal should be closed.
 * `formik`: A property that holds a reference to a Formik form.
 */
export interface StockCodeModalProps {
  isOpen: boolean;
  onClose: VoidFunction;
  formik: any;
}
