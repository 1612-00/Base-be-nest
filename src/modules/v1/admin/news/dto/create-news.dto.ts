import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsBooleanString, IsDate, IsInt, IsMongoId, IsNotEmpty, isString, IsString } from "class-validator";

export class CreateNewsDto {
    @ApiProperty({ type: String })
    @IsString()
    @IsNotEmpty({ message: 'News title name cannot be empty' })
    readonly title: string = '';
  
    @ApiProperty({ type: Date })
    //@IsDate({ message: 'Publish date news must be a date' })
    readonly publishedDate: Date = new Date();

    @ApiProperty({ type: Boolean})
    @IsBooleanString()
    readonly status: boolean = false;

    @ApiProperty({ type: String})
    @IsString({message:'Content news must be a string'})
    readonly content: string = '';

    @ApiProperty({ type: Boolean ,  default: false  })
    @IsBooleanString()
 //   @IsNotEmpty({ message: 'Home display cannot be empty' })
    readonly homeDisplay: boolean = false;

}
