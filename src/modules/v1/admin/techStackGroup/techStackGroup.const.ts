import { fileMimetypeFilter } from "src/shared/uploadServices/uploadFiles.validation";
import { diskStorage, memoryStorage } from 'multer';

export const TECH_STACK_GROUP_CONST = {
    MODEL_NAME: 'TechStackGroup',
  };

  export const uploadFileUser = {
    storage: memoryStorage(),
    fileFilter: fileMimetypeFilter('file','avi','flv','mov','mp4','mpg','wmv','bmp','cur','ico','gif','jpg','jpeg','png','psd','raw','tif')
  };
  