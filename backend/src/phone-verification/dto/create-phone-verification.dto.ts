export class CreatePhoneVerificationDto {
  userId!: number;
  phoneNumber!: string;
  code!: string;
  verified!: boolean;
}
