import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayloadrWithRefreshToken } from '../types';

// export const GetCurrentUser = createParamDecorator(
//   (data: keyof JwtPayloadrWithRefreshToken | undefined, context: ExecutionContext) => {
//     const request = context.switchToHttp().getRequest();
//     if (!data) return request.user;
//     return request.user[data];
//   },
// );

export const GetCurrentUser = createParamDecorator(
  (data: keyof JwtPayloadrWithRefreshToken | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!data) return request.user;
    return request.user[data];
  },
);

// export const GetCurrentUser = createParamDecorator((data, req) => {
//   return data ? req.cookies && req.cookies[data] : req.cookies;
// });