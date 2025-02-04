import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CURRENT_USER_KEY } from 'src/utilities/constants';
import { JWTPayloadType } from 'src/utilities/types';

export const CurrentUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    const request: Request = context.switchToHttp().getRequest();
    const payload: JWTPayloadType = request[CURRENT_USER_KEY] as JWTPayloadType;
    return payload;
  },
);
