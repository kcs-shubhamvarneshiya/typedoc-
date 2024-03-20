import { DataType } from "./DataType"

export type DataFieldType={
    id: number
    field: string
    isActive: boolean
    updatedBy: number
    updatedDate: Date
    types: DataType[]
}