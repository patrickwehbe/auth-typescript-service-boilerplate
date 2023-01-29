import { IsOptional, IsString } from "class-validator";



export class MonitorGetQuery{

    @IsOptional()
    @IsString()
    organizationId:string;
    
    @IsOptional()
    @IsString()
    objectIds:string;

    @IsOptional()
    @IsString()
    objectNames:string;

    @IsOptional()
    @IsString()
    userIds:string;

}