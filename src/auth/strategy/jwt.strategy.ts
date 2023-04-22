// import { Injectable } from "@nestjs/common";
// import { ConfigService } from "@nestjs/config";
// import { PassportStrategy } from "@nestjs/passport";
// import { ExtractJwt, Strategy } from "passport-jwt";
// import { PrismaService } from "../../prisma/prisma.service";
// import { JwtPayload } from "../types";



// @Injectable()
// export class JwtStrategy extends PassportStrategy(
//     Strategy,
//     'jwt',
// ){
//     constructor(
//          config: ConfigService,
//          private  prisma: PrismaService,){
//         super({
//             jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//             secretOrKey: config.get('JWT_SECRET'),
//         })
//     }

//     async validate(payload:JwtPayload){
//         const user = await this.prisma.user.findFirst({
//                 where: {
//                     id: payload.sub,
//                     email: payload.email
//                 }
//             })
  
//                 delete user.hash;
//                 return user;
           
 
       
//     }
// }

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from "@nestjs/config";
import { JwtPayload } from "../types";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt',) {
  constructor(config: ConfigService,) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  private static extractJWT(req: Request): string | null {
    if (req.cookies && 'token' in req.cookies) {
      const {access_token} = req.cookies.token
      // console.log("access_token " +access_token)
      return access_token;
    }
    return null;
  }

  async validate(payload:JwtPayload) {
    return payload;
  }
}