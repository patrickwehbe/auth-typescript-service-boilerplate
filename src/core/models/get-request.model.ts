import { IsNumberString, IsEnum, IsOptional, IsNumber } from "class-validator";

export enum SortOrder {
	ASC = "ASC",
	DESC = "DESC"
}


export function CommonGETRequestValidation (SortByField): any{

    class GetQueryParams{
        
        @IsOptional()
        @IsNumberString()
        itemsPerPage: number;
     
        @IsOptional()
        @IsNumberString()
        pageNumber: number;
     
        @IsOptional()
        @IsEnum(SortOrder, { each: true})
        sort:string;
     
        @IsOptional()
        @IsEnum(SortByField, { each: true})
        sortBy: string;
    }
    return GetQueryParams;
}

// tslint:disable-next-line: max-classes-per-file
export class PaginationMetaResponse {
	/**
	 * item per page
	 * @type {number}
	 */
	@IsNumber()
	itemsPerPage:number;


	/**
	 * total number of items
	 * @type {number}
	 */
	 @IsNumber()
	totalItems:number;


	/**
	 * total number of pages
	 * @type {number}
	 */
	 @IsNumber()
	totalPages:number
}

