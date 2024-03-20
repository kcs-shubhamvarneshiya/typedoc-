/***
 * This class definition creates a type called AttachmentType in TypeScript.

  `id`: Represents the unique identifier of the attachment.
  `Name`: Represents the name of the attachment.
  `AttachType`: Represents the type of attachment.
  `Family`: Represents the family of the attachment.
  `Item`: Represents the item associated with the attachment.
  `Prefix`: Represents the prefix of the attachment.
  `Lvl`: Represents the level of the attachment.
  `isActive`: Represents whether the attachment is active or not.
  `UpdatedBy`: Represents the user who last updated the attachment.
  `UpdatedDate`: Represents the date when the attachment was last updated.
 
  */
export type AttachmentType = {
  id: number;
  Name: string;
  AttachType: string;
  Family: string;
  Item: string;
  Prefix: string;
  Lvl: string;
  isActive: boolean;
  UpdatedBy: number;
  UpdatedDate: Date;
};
