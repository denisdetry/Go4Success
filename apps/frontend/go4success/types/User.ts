export interface User {
    id: number;
    password: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    noma: string;
    isActive: boolean;
    isStaff: boolean;
    isSuperuser: boolean;
    dateJoin: string;
    lastLogin: string;
    groups: number[];
    userPermissions: number[];
}
