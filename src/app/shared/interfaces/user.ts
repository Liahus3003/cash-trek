export interface User {
    _id: string;
    name: string;
    createdDate?: Date;
    isAdmin: boolean;
    email: string;
    lastLogin: Date;
}
