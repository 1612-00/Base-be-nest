import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';

@Injectable()
export class ParseArrayFile implements PipeTransform {
  transform(
    files: Express.Multer.File[],
    metadata: ArgumentMetadata,
  ): Express.Multer.File[] {
    files.forEach((file: Express.Multer.File) => {
      if (file.size > 524288000) {
        throw new UnsupportedMediaTypeException(
          'file size must be less than 500MB',
        );
      }
      const validExtendFile = [
        'png',
        'jpg',
        'jpeg',
        'gif',
        'mp4',
        'video/quicktime',
      ];

      const isValidTypeMedia = validExtendFile.some((m) =>
        file.mimetype.includes(m),
      );
      if (!isValidTypeMedia) {
        throw new UnsupportedMediaTypeException(
          `File type is not matching: ${validExtendFile.join(', ')}`,
        );
      }
    });

    return files;
  }
}
