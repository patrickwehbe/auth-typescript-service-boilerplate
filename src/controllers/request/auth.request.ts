import { IsBase64, IsEmail, IsOptional, IsString } from "class-validator";


export class SignUpRequest {
	
	@IsString()
	firstName:string;

	@IsEmail()
	email: string;

	@IsString()
	roleId: string;

	@IsString()
	organizationId: string;

}

export class VerifyUserRequest{

	@IsOptional()
	@IsString()
	firstName:string

	@IsOptional()
	@IsString()
	lastName:string;

	@IsOptional()
	@IsBase64()
	image: string;

	@IsString()
	token:string;

	@IsString()
	password:string
}

export class LoginRequest{

	@IsEmail()
	email: string;

	@IsString()
	password:string
}

export class ResetPasswordRequest{
	@IsEmail()
	email: string;
}

export class ResetPasswordVerifyRequest{

	@IsString()
	token:string;

	@IsString()
	password:string
}


export class PutUserAccessToken{

	@IsString()
	accessToken:string;

	@IsString()
	refreshToken:string;
}

export class PostUserOrgAccessToken{

	@IsString()
	accessToken:string;

	@IsString()
	organizationId:string;
}

export class updatePasswordRequest{

	@IsEmail()
	email:string;

	@IsString()
	password:string
}