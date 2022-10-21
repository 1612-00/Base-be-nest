import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  UnsupportedMediaTypeException,
} from '@nestjs/common';

@Injectable()
export class ParseFile implements PipeTransform {
  transform(
    files: Express.Multer.File,
    metadata: ArgumentMetadata,
  ): Express.Multer.File | undefined {
    console.log('==>single files', files);
    if (files) {
      if (files.size > 524288000) {
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
        files.mimetype.includes(m),
      );
      if (!isValidTypeMedia) {
        throw new UnsupportedMediaTypeException(
          `File type is not matching: ${validExtendFile.join(', ')}`,
        );
      }
      return files;
    }
  }
}
