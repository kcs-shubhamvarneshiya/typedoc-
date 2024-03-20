import { Permission } from "../models/Permission";
import { SessionDetails } from "../models/SessionDetails";
import { User } from "../models/User";

export default class SessionService {
    sessionDetails: SessionDetails;
    
    public static getInstance = () => new SessionService();

    public constructor() {
        this.sessionDetails = JSON.parse(localStorage.getItem("session") || '{}');
    }

    public setSession = (data: SessionDetails) => {
        localStorage.setItem("session", JSON.stringify(data));
    }

    public clearSession = () => { localStorage.removeItem("session") }

    public isLoggedIn = (): boolean => {
        return !!this.sessionDetails.token;
    }

    public getCurrentUser = (): User => {
        return this.sessionDetails.user;
    }

    public getSessionToken = (): string => {
        return this.sessionDetails.token;
    }

    public getUserPermissions = (): Permission[] => {
        return this.sessionDetails.user.roles.map(r => r.permissions).flatMap(permissions => permissions);
    }

    public hasPermission = (permission: string) => {
        return this.sessionDetails.user.roles.some(r => !!r.permissions.find(p => p.name === permission))
    }
}