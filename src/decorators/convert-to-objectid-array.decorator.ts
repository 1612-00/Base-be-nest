import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import responseS5M from '../common/response';
import { OBJECTID_REGEX } from '../constants/regex.constants';
import { ValidateMessage } from '../constants/validate.constants';
import HttpStatusCode from '../shared/statusCode.enum';

export const ConvertToObjectIdArray = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (data) {
      const memberList: string | undefined = request.body[data];
      let memberListArray: string[] | undefined;
      if (memberList) {
        memberListArray = memberList.split(',');
        for (const member of memberListArray) {
          if (!member.match(OBJECTID_REGEX))
            return responseS5M(
              HttpStatusCode.BAD_REQUEST,
              undefined,
              `Member ${ValidateMessage.OBJECTID_NOT_VALID}`,
            );
        }
      }

      return memberListArray;
    }
  },
);
