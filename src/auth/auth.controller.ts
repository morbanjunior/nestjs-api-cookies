import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Tokens } from './types';
import { GetCurrentUserId, Public } from './decorator';
import { GetCurrentUser } from './decorator/get-fresh.decorator';
import { jwt_refresh } from './guard/jwt_refres.guard';
import { JwtGuard } from './guard';

@Controller('auth')
export class AuthController {
    constructor(private auth:AuthService){}

    // @Public()
    @HttpCode(HttpStatus.CREATED)
    @Post('local/signup')
    signup(@Body() dto: AuthDto):Promise <Tokens>{
        return this.auth.signup(dto);
    }

    // @Public()
    // @HttpCode(HttpStatus.OK)
    // @Post('local/signin')
    // signin(@Body() dto: AuthDto):Promise <Tokens>{
    //     return this.auth.signin(dto);
    // }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('local/signin')
    signin(
        @Body() dto: AuthDto,
        @Req() req, 
        @Res() res
    ){
        return this.auth.signin(dto, req, res);
    }

   
    // @HttpCode(HttpStatus.OK)
    // @Post('logout')
    // logout(@GetCurrentUserId() userId: number){
    //     return this.auth.logout(userId);
    // }

    
    
    @HttpCode(HttpStatus.OK)
    @Post('logout')
    logout(
        @GetCurrentUserId() userId: number, 
        @Res({passthrough: true}) res){
        return this.auth.logout(userId,res);
    }

    // @Public()
    // @UseGuards(jwt_refresh)
    // @HttpCode(HttpStatus.OK)    
    // @Post('refreshToken')
    // refresh(
    //     @GetCurrentUserId() userId: number,
    //     @GetCurrentUser('refreshToken') refreshToken: string
    //     ){
    //     return this.auth.refresh(userId, refreshToken)
    // }


    // @Public()
    // @UseGuards(jwt_refresh)
    // @HttpCode(HttpStatus.OK)    
    // @Post('refreshToken')
    // refresh(
    //     @GetCurrentUserId() userId: number,
    //     @GetCurrentUser('refreshToken') refreshToken: string
    //     ){
    //     return this.auth.refresh(userId, refreshToken)
    // }


    @Public()
    @UseGuards(jwt_refresh)
    @HttpCode(HttpStatus.OK)    
    @Get('refreshtoken')
    refresh( 
        @Res({passthrough: true}) Res,
        @GetCurrentUserId() userId: number,
        @GetCurrentUser('refresh_token') refreshToken: string
        ){
            return this.auth.refresh(userId,refreshToken, Res)
    }


}
