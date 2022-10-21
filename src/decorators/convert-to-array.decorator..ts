import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ConvertToArray = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (data) {
      const value: string | undefined = request.body[data];
      let valueArray: string[] | undefined;
      if (value) {
        valueArray = value.split(',');
      }

      return valueArray;
    }
  },
);
