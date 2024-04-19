export class TreeNodeDto {
    key: string;
    permissionId: number;
    data: string;
    label: string;
    fatherId: number;
    icon: string;
    expanded: boolean;
    typeId: number;
    active: boolean;
    positionId: number;
    children: TreeNodeDto[]
}
