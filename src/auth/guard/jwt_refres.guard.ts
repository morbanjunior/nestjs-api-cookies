import { AuthGuard } from "@nestjs/passport";

export class jwt_refresh extends AuthGuard('jwt-refresh'){
    constructor(){
        super();
    }
}