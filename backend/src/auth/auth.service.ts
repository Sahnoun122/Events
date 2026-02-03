
import { JwtService } from '@nestjs/jwt';
import { BadRequestException , Injectable , UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class AuthService {

    constructor(
        private userService : UsersService,
        private jwtSerrvice : JwtService
    ){}

    async register (body : any){
        const user = await this.userService.findByEmail(body.email)   
    
     if(user){
        throw new BadRequestException("email already exists");
     }
     const hashPassword = await bcrypt.hash(body.password , 10);

     return this.userService.create({

        fullName: body.fullName,
        email: body.email,
        password:hashPassword,
        roles: body.roles
     });
    }

    async login (email: string , password : string){

        const user = await this.userService.findByEmail(email);

        if(!user){
            throw new BadRequestException("email ou mot de passe incorect");
        }

        const comparPassword = await bcrypt.compare(password, user.password);

        if(!comparPassword){
            throw new BadRequestException("email ou mot de incorrecte ")
        }

       const payload = {
        sub : user._id,
        email : user.email,
        roles: user.roles,
       }

       return{
        access_token : this.jwtSerrvice.sign(payload),
       }
    }
}
