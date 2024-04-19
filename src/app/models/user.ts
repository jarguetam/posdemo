import { Menu } from "./menu";
import { Permission } from "./permission";

export class User {
    userId: number;
    name: string;
    userName: string;
    email: string;
    roleId: number;
    role: string;
    themeId: number;
    branchId: string;
    theme: string;
    password: string;
    permissions: Permission[];
    menu: Menu[];
    active: boolean;
    token?: string;
    salesPerson: boolean;
    whsCode: number;
    sellerId: number;
    sarCorrelativeId: number;
    correlativeName: string;
    sellerName: string;
}
