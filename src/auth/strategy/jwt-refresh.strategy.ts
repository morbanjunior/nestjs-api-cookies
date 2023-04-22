// import { ForbiddenException, Injectable } from "@nestjs/common";
// import { ConfigService } from "@nestjs/config";
// import { PassportStrategy } from "@nestjs/passport";
// import { ExtractJwt, Strategy } from "passport-jwt";
// import { PrismaService } from "../../prisma/prisma.service";
// import { JwtPayload, JwtPayloadrWithRefreshToken } from "../types";
// import { Request } from "express";



// @Injectable()
// export class jwt_refreshStrategy extends PassportStrategy(
//     Strategy,
//     'jwt-refresh',
// ){
//     constructor(
//          config: ConfigService,
//          private  prisma: PrismaService,){
//         super({
//             jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//             secretOrKey: config.get('JWT_SECRET_REFRESH'),
//             passReqToCallback: true,
//         })
//     }

//     validate(req: Request, payload: JwtPayload): JwtPayloadrWithRefreshToken {
//         const refreshToken = req
//           ?.get('authorization')
//           ?.replace('Bearer', '')
//           .trim();
    
//         if (!refreshToken) throw new ForbiddenException('Refresh token malformed'); 
    
//         return {
//           ...payload,
//           refreshToken,
//         };
//       }
// }


import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from "@nestjs/config";
import { JwtPayload } from "../types";

@Injectable()
export class jwt_refreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh',) {
  constructor(config: ConfigService,) {
    super({
      
      jwtFromRequest: ExtractJwt.fromExtractors([
        jwt_refreshStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: config.get('JWT_SECRET_REFRESH'),
      ignoreExpiration: true,
      passReqToCallback: true,
    });
  }

  private static extractJWT(req: Request): string | null {
    if (req.cookies && 'token' in req.cookies) {
      const {refresh_token} = req.cookies.token
      // console.log("Token_Refresh " +refresh_token)
      return refresh_token;
    }
    return null;
  }

  async validate(req: Request,payload:JwtPayload) {
    let refresh = req?.cookies['token']
    if(!refresh){
      throw new BadRequestException()
    }

    if(!refresh.refresh_token){
      throw new BadRequestException()
    }
    const refresh_token = refresh.refresh_token
    return {...payload,refresh_token };
  }
}