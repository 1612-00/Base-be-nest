import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateHomeConfigDto {
  @ApiPropertyOptional({ name: 'url', type: String })
  @IsOptional()
  readonly url: string = '';

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  readonly slogan: string | undefined;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  readonly subSlogan: string | undefined;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  readonly content1WhoWeAreTitle: string | undefined;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  readonly content1WhoWeAreSubTitle: string | undefined;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  readonly content1GreenBoxTitle: string | undefined;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  readonly content1GreenBoxSubTitle: string | undefined;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  readonly infoBox1Content: string | undefined;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  readonly infoBox1Title: string | undefined;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  readonly infoBox2Content: string | undefined;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  readonly infoBox2Title: string | undefined;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  readonly blackBoxTitle: string | undefined;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  readonly blackBoxContent: string | undefined;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  readonly blackBoxTitle2: string | undefined;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  readonly blackBoxContent2: string | undefined;
}
