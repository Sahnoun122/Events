import { Role } from 'src/common/enums/role.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    type: [String],
    enum: Role,
    default: [Role.PARTICIPANT],
  })
  roles: [Role];
}

export const UserSchema = SchemaFactory.createForClass(User);