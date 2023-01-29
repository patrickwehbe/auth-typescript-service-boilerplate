import { User } from "../../models";

export interface IUpdateUser{
    email:string
    password?:string,
    isActive?:boolean
}

export interface IAccessToken {
    data:{
        identityId:string;
        requestId:string;
    }
}

export interface IResetPasswordToken{
    data:{requestId:string;
    email:string
    }
}

export interface IAuthRepository {
	

	/**
     *
     * create user into the database
     * @param {User} user
     * @returns {Promise<User>}
     * @memberof IAuthRepository
     */
    createUser(user:User): Promise<User>;

    
    /**
     *
     * update user data into the database
     * @param {IUpdateUser} user
     * @returns {Promise<User>}
     * @memberof IAuthRepository
     */
    updateUser(user:IUpdateUser):Promise<User>



    /**
     *
     * Get user by email id 
     * @param {string} email
     * @returns {Promise<User>}
     * @memberof IAuthRepository
     */
    getUserByEmail(email:string):Promise<User>
}
