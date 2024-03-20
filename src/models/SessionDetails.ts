import { Role } from "./Role";
import { User } from "./User";

export type SessionDetails = {
    token: string;
    user: User;
}