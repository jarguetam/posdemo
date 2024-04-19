import { TreeNodeDto } from "./tree.node.dto";

export class Role {
    roleId: number;
    description: string;
    active: boolean;
    detail: TreeNodeDto[]
}
