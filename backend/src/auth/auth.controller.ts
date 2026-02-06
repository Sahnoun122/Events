import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';

@Controller('auth')
export class AuthController {
    constructor(
        private authService : AuthService
    ){}

    @Post("register")
    register(@Body() body : any){
        return this.authService.register(body);
    }

    @Post("login")
     login(@Body() body: any){
        return this.authService.login(body.email , body.password)
     }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@CurrentUser() user: any) {
        return { user };
    }
}
