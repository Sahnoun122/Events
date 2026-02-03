import { Injectable } from '@nestjs/common';
import { User, UserDocument} from './users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {

  constructor(

  @InjectModel(User.name)
   private userModel: Model<UserDocument>

){}

create(data : Partial<User>){
  return this.userModel.create(data);
}

findByEmail(email : string){
  return this.userModel.findOne({email});
}
}
