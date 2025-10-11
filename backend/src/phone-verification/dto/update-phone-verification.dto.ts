import { PartialType } from '@nestjs/mapped-types';
import { CreatePhoneVerificationDto } from './create-phone-verification.dto';

export class UpdatePhoneVerificationDto extends PartialType(CreatePhoneVerificationDto) {}
