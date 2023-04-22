import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { JwtPayload, Tokens } from './types';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
    constructor(private config: ConfigService,
        private prisma: PrismaService,
        private jwt: JwtService,){}

    async signup(dto: AuthDto): Promise <Tokens>{

        //generate the passwword hash
        const hash = await argon.hash(dto.password);

        //  Save the new user in the db
        try{
            const user = await this.prisma.user.create({
                data:{
                    email: dto.email,
                    hash,
                    
                }
            });
            const userId = user.id

             await this.prisma.setting.create({
                data: {
                    userId,
                    businesName: 'Not name yet',
                    address: 'Not name yet', 

                }
            })
            const tokens = await this.getTokens(user.id, user.email);
            await this.updateRtHash(user.id, tokens.refresh_token);

            return tokens;

        }catch(error){
            if(error instanceof PrismaClientKnownRequestError){
                if (error.code === 'P2002'){
                    throw new ForbiddenException(
                        'Cedetnials Taken'
                    )
                }
                throw error;
            }
        }
        
       
    }

   

    // async logout(userId: number){
    //     await this.prisma.user.updateMany({
    //         where:{
    //             id: userId,
    //             refreshtoken:{
    //                 not: null,
    //             },
                
    //         },
    //         data: {
    //             refreshtoken: null
    //         }
    //     })
    //     return "user logout"
    // }

    async logout(userId: number, res: Response){
            await this.prisma.user.updateMany({
            where:{
                id: userId,
                refreshtoken:{
                    not: null,
                },
                
            }, 
            data: {
                refreshtoken: null
            }
        })
        res.clearCookie('token')
        return "Logged out succesfull"
    }
    async refresh(userId: number, refreshToken:string, res: Response){
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        // if user does not exist throw exception
        if (!user)
            throw new ForbiddenException(
                "credentials incorrect"
            );
            // compare password
                const pwMatches = await argon.verify(user.refreshtoken,
                    refreshToken);
            // if password inscorrect throw eception
            if (!pwMatches)
                    throw new ForbiddenException(
                        'Credentials incorrect',
                    );


          
        const tokens = await this.getTokens(user.id, user.email);
            await this.updateRtHash(user.id, tokens.refresh_token);

            res.cookie('token', tokens, {httpOnly: true, domain: 'localhost',})
            const token = tokens.access_token
            return {token};  
    }


    async signin(dto: AuthDto, req: Request, res: Response){

        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });
        // if user does not exist throw exception
        if (!user)
            throw new ForbiddenException(
                "credentials incorrect"
            );
            // compare password
                const pwMatches = await argon.verify(
                    user.hash,
                    dto.password,
                )
            // if password inscorrect throw eception
            if (!pwMatches)
                    throw new ForbiddenException(
                        'Credentials incorrect',
                    );

            // send back the user and settings

            const userId = user.id
            


           const  settingsItems= await this.prisma.setting.findFirst({
                where:{
                    userId
                }
            })
    
        //     const tokenUser = await this.signToken(user.id, user.email)
        //    const settingId = settingsItems.id

            
        const tokens = await this.getTokens(user.id, user.email);
            await this.updateRtHash(user.id, tokens.refresh_token);

            if(!tokens) throw new ForbiddenException()
            // const frontendDomain = this.configService.get<string>('FRONTEND_DOMAIN');
            res.cookie('token', tokens, {httpOnly: true, domain: 'localhost',})
            const token = tokens.access_token
            return res.send({token});  
    }

    async updateRtHash(userId: number, rt: string): Promise<void> {
        const hash = await argon.hash(rt);
        await this.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            refreshtoken: hash,
          },
        });
      }
    async getTokens(
        userId: number,
        email: string,
    ): Promise<Tokens>{
        const payload:JwtPayload = {
            sub: userId,
            email,
        }

        const secret = this.config.get<string>('JWT_SECRET')

        const token = await this.jwt.signAsync(payload, {
            // expiresIn: '20m',
            expiresIn: '5s',
            secret: secret,
        })

        const secretRefresh = this.config.get<string>('JWT_SECRET_REFRESH')

        const tokenRefresh = await this.jwt.signAsync(payload, {
            expiresIn: '5d',
            secret: secretRefresh,
        })

        return {
            access_token: token,
            refresh_token: tokenRefresh
        };
        
       
    } 

}
