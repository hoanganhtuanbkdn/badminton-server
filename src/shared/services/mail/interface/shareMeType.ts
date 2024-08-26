import { Expose } from 'class-transformer';

export class ShareMeType {
  @Expose()
  firstName: string;
  @Expose()
  lastName: any;
  dataRate: DataRateType[];
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
  searchId: string;
  @Expose()
  time: Date;
  @Expose()
  loanPurpose: string;
  @Expose()
  loanAmount: any;
  @Expose()
  loanTerm: string;
}

export class DataRateType {
  @Expose()
  rate: any;
  @Expose()
  apr: any;
  @Expose()
  investor: any;
  @Expose()
  credit: any;
  @Expose()
  point: any;
  @Expose()
  closingCost: any;
  @Expose()
  payment: any;
  @Expose()
  lastUpdate: any;
  @Expose()
  price: any;
  @Expose()
  principalAndInterest: any;
}
