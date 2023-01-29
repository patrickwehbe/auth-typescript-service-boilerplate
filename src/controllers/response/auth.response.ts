import { IsString } from "class-validator";

export class CommonStatusResponse{
	@IsString()
	status:string
}
export class UserOrgRole{

    roleId:string;
    roleName:string;
    organizationId:string;
    organizationName:string;

}
 export class UserOrgResponse {
	
	id: string;

	firstName: string;

	lastName?: string;

    email: string;

    identityId: string;
      
	image?: string;

	roleId: string;
	  
	role:string

	organizationName:string
	   
    organizationId: string;

    roles?:UserOrgRole[]

}

export class TokenResponse {
    token:string;
	expiresAt:Date
}
export class AuthLoginResponse{
    user:UserOrgResponse;
    tokens:{
        accessToken:string;
        accessTokenExpiresAt:Date;
        refreshToken:string;
        refreshTokenExpiresAt:Date
    }
}

export class AuthAccessRefreshTokenResponse {

    accessToken:string;
    refreshToken:string
}

export class CurrentUserResponse {
    user:UserOrgResponse
}