import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { MessageTemplate } from '../../../../constants/message.constants';

export class CreateHomeConfigDto {
  @ApiProperty({ name: 'url', type: String })
  @IsNotEmpty({ message: MessageTemplate.EMPTY })
  readonly url: string = '';

  @ApiProperty({ type: String })
  @IsNotEmpty({ message: MessageTemplate.EMPTY })
  readonly slogan: string | undefined;

  @ApiProperty({ type: String })
  @IsNotEmpty({ message: MessageTemplate.EMPTY })
  readonly subSlogan: string | undefined;

  @ApiProperty({ type: String })
  @IsNotEmpty({ message: MessageTemplate.EMPTY })
  readonly content1WhoWeAreTitle: string | undefined;

  @ApiProperty({ type: String })
  @IsNotEmpty({ message: MessageTemplate.EMPTY })
  readonly content1WhoWeAreSubTitle: string | undefined;

  @ApiProperty({ type: String })
  @IsNotEmpty({ message: MessageTemplate.EMPTY })
  readonly content1GreenBoxTitle: string | undefined;

  @ApiProperty({ type: String })
  @IsNotEmpty({ message: MessageTemplate.EMPTY })
  readonly content1GreenBoxSubTitle: string | undefined;

  @ApiProperty({ type: String })
  @IsNotEmpty({ message: MessageTemplate.EMPTY })
  readonly infoBox1Content: string | undefined;

  @ApiProperty({ type: String })
  @IsNotEmpty({ message: MessageTemplate.EMPTY })
  readonly infoBox1Title: string | undefined;

  @ApiProperty({ type: String })
  @IsNotEmpty({ message: MessageTemplate.EMPTY })
  readonly infoBox2Content: string | undefined;

  @ApiProperty({ type: String })
  @IsNotEmpty({ message: MessageTemplate.EMPTY })
  readonly infoBox2Title: string | undefined;

  @ApiProperty({ type: String })
  @IsNotEmpty({ message: MessageTemplate.EMPTY })
  readonly blackBoxTitle: string | undefined;

  @ApiProperty({ type: String })
  @IsNotEmpty({ message: MessageTemplate.EMPTY })
  readonly blackBoxContent: string | undefined;

  @ApiProperty({ type: String })
  @IsNotEmpty({ message: MessageTemplate.EMPTY })
  readonly blackBoxTitle2: string | undefined;

  @ApiProperty({ type: String })
  @IsNotEmpty({ message: MessageTemplate.EMPTY })
  readonly blackBoxContent2: string | undefined;
}
