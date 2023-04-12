export interface UserDetail {
    roles: Array<Role>,
    name: string,
    email: string,
    mobile: number,
    isEmailVerified: boolean,
    isMobileVerified: boolean,
    pictureUrl?: string,
    profileId: number
}

interface Role {
    key: string
}