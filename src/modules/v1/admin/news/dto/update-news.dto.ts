import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsBooleanString, IsString } from 'class-validator';
import { CreateNewsDto } from './create-news.dto';

export class UpdateNewsDto  {
    @ApiProperty({ type: String })
    @IsString()
    readonly title: string = '';
  
    @ApiProperty({ type: Date })
    //@IsDate({ message: 'Publish date news must be a date' })
    readonly publishedDate: Date = new Date();

    @ApiProperty({ type: Boolean,required: false})
    //@IsBooleanString()
    @Type(()=> Boolean)
    readonly status: boolean = false;

    @ApiProperty({ type: String})
    @IsString({message:'Content news must be a string'})
    readonly content: string = '';

    @ApiProperty({ type: Boolean ,required: false  })
    @Type(()=> Boolean)
    readonly homeDisplay: boolean = false;

}
