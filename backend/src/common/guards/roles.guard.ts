import { CanActivate , ExecutionContext , Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { Role } from "../enums/role.enum";
import { Observable } from "rxjs";

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean  {
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
        ROLES_KEY,
        [context.getHandler() , context.getClass()]
     );

     if(!requiredRoles) return true;

     const request = context.switchToHttp().getRequest();
     const user = request.user;

     console.log('Required roles:', requiredRoles);
     console.log('User object:', user);
     console.log('User roles:', user?.roles);
     console.log('Comparison result:', requiredRoles.some(role => user?.roles?.includes(role)));

     return requiredRoles.some(role=>
        user?.roles?.includes(role)
     );
  }
}