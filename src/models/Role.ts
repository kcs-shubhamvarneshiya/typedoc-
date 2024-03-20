import { Permission } from "./Permission"

export type Role = {
    id: number
    name: string
    isActive: boolean
    permissions: Permission[]
}