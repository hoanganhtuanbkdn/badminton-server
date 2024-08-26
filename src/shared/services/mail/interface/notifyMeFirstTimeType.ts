import { Expose } from 'class-transformer';

export class NotifyMeFirstTimeType {
  @Expose()
  firstName: string;
  @Expose()
  lastName: string;
  @Expose()
  loanAmount: any;
  @Expose()
  loanTerm: string;
  @Expose()
  targetRate: number;
  @Expose()
  targetPoint: number | string;
  @Expose()
  targetMonthlyPayment: number | string;
  @Expose()
  propertyAmount: any;
  @Expose()
  occupancy: string;
  @Expose()
  propertyType: string;
  @Expose()
  zipCode: any;
  @Expose()
  creditScore: any;
  @Expose()
  loanPurpose: string;
  @Expose()
  searchId: string;
  @Expose()
  time: Date;
}
