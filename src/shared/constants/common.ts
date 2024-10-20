import * as crypto from 'crypto';
import { AdminProfile } from 'src/admin';
import { v4 as uuidv4 } from 'uuid';

export const REQUEST_ID_TOKEN_HEADER = 'x-request-id';

export const FORWARDED_FOR_TOKEN_HEADER = 'x-forwarded-for';

export const VALIDATION_PIPE_OPTIONS = { transform: true, whitelist: true };

export const REGEX_PASSWORD =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[?<>!@.#$%^&*(){}|/"~`'_ ])(?=.*[a-zA-Z0-9?<>!@#$%^&*().{}|/"~`'_ ]).{8,16}$/;
export const REGEX_MATCH_PASSWORD = /^[a-zA-z0-9?<>!@.#$%^&*(){}|/"~`'_]*$/;
// export const REGEX_PHONE_NUMBER = /^[\+]?[(]?[2-9]{1}[0-9]{2}[)]?[-\s\.]?[2-9]{1}[0-9]{2}[-\s\.]?[0-9]{4,6}$/;
export const REGEX_PHONE_NUMBER = /^[2-9]{1}[0-9]{2}[2-9]{1}[0-9]{2}[0-9]{4}$/;
export const REGEX_OTP_CODE = /^\d{6}/;
export const REGEX_EMAIL =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
export const REGEX_TIME = /^([0-1]?\d|2[0-3])(?::([0-5]?\d))?(?::([0-5]?\d))?$/;
export const REGEX_ENG_CAP_NUMBER = /^[a-zA-Z0-9]*$/;
export const REGEX_FLOAT_POINT_8_2 = /^[0-9]{0,8}(\.[0-9]{1,2})?$/;
export const REGEX_FLOAT_POINT_10_2 = /^[0-9]{1,10}.[0-9]{1,2}$/;
export const FORMAT_DATE_TIME_1 = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})$/;
export const REGEX_NUMBER = /^\d+$/;

export const REGEX_PERSON_NAME = /^[a-zA-Z\sก-๏\s]+$/;
export const REGEX_CORPORATE_NAME = /^[a-zA-Z\sก-๏\s&\-\/,0-9_*'*~'#@!?&%^()+]+$/;
export const REGEX_CORPORATE_ADDRESS = /^[a-zA-Z\sก-๏\s&\-\/.,0-9]+$/;
export const REGEX_CONTACT_NAME = /^[_A-z0-9ก-๏]*((-|\s)*[_A-z0-9ก-๏])*$/;
export const REGEX_CONTACT_NAME_2 = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]+$/;
export const ERR_MSG_FORMAT_PHONE_NUMBER =
  'Phone number format: (NXX) NXX-XXXX, where N is 2–9 and X is 0–9. Please try again!';

export const requireFieldLength = (field: string, maxChar: string) => {
  return `The ${field} exceeded  a maximum length of ${maxChar} characers.`;
};

export const requireFieldMinLength = (field: string, minChar: string) => {
  return `The length of ${field} must be greater than ${minChar} characters`;
};

export const requireFieldNotEmpty = (field: string) => {
  return `Please enter ${field}`;
};

export const requireMaxField = (field: string, maxValue: string) => {
  return `${field} cannot greater than ${maxValue}.`;
};

export const requireMinField = (field: string, minValue: string) => {
  return `${field} cannot less than ${minValue}.`;
};

export const requireFormatFloatNumber = (field: string, precision: string, scale: string) => {
  return `${field} do not correct format precision ${precision} and scale ${scale}.`;
};

export const agencyModulePermission = [
  'purchase',
  'payment_breakdown',
  'refinance',
  'mortgage_calculator',
  'affordability_calculator',
  'learning_center',
  'all_rates',
  'customized_rate',
  'loan_options',
  'pre-qualification'
];

export enum assetDocumentation {
  Verified = 'Verified',
  Stated = 'Stated',
  None = 'None',
}
export enum citizenship {
  USCitizen = 'USCitizen',
  USCitizenAbroad = 'USCitizenAbroad',
  PermResidentAlien = 'PermResidentAlien',
  NonPermResidentAlien = 'NonPermResidentAlien',
  ForeignNational = 'ForeignNational',
}

export enum employmentDocumentation {
  Verified = 'Verified',
  Stated = 'Stated',
  None = 'None',
}

export enum incomeDocumentation {
  Verified = 'Verified',
  Stated = 'StatedWithIRSForm',
  None = 'None',
  StatedWithoutIRSForm = 'StatedWithoutIRSForm',
}

export enum vaServiceType {
  ActiveDuty = 'ActiveDuty',
  NationalGuardOrReserves = 'NationalGuardOrReserves',
}

export enum vaUseType {
  FirstTimeUse = 'FirstTimeUse',
  SubsequentUse = 'SubsequentUse',
}

export enum bankruptcy {
  Never = 'Never',
  MoreThan5YearsAgo = 'MoreThan5YearsAgo',
  Last49To60Months = 'Last49To60Months',
  Last37To48Months = 'Last37To48Months',
  Last25To36Months = 'Last25To36Months',
  Last13To24Months = 'Last13To24Months',
  Last1To12Months = 'Last1To12Months',
}

export enum bankruptcyChapter {
  Chapter7 = 'Chapter7',
  Chapter13 = 'Chapter13',
}

export enum bankruptcyDisposition {
  Discharged = 'Discharged',
  Dismissed = 'Dismissed',
  Pending = 'Pending',
  Unknown = 'Unknown',
}
export enum foreclosure {
  Never = 'Never',
  Dismissed = 'Last49To60Months',
  Pending = 'Last37To48Months',
  Last13To24Months = 'Last13To24Months',
  Last1To12Months = 'Last1To12Months',
  MoreThan5YearsAgo = 'MoreThan5YearsAgo',
}

export enum bankStatementsForIncome {
  NotApplicable = 'NotApplicable',
  SixMonths = 'SixMonths',
  TwelveMonths = 'TwelveMonths',
  TwentyFourMonths = 'TwentyFourMonths',
}

export enum occupancy {
  InvestmentProperty = 'InvestmentProperty',
  PrimaryResidence = 'PrimaryResidence',
  SecondHome = 'SecondHome',
}
export enum propertyType {
  SingleFamily = 'SingleFamily',
  Condo = 'Condo',
  ManufacturedDoubleWide = 'ManufacturedDoubleWide',
  Condotel = 'Condotel',
  Modular = 'Modular',
  PUD = 'PUD',
  Timesharer = 'Timesharer',
  ManufacturedSingleWide = 'ManufacturedSingleWide',
  Coop = 'Coop',
  NonWarrantableCondo = 'NonWarrantableCondo',
  Townhouse = 'Townhouse',
  DetachedCondo = 'DetachedCondo',
}
export enum numberOfUnits {
  OneUnit = 'OneUnit',
  TwoUnits = 'TwoUnits',
  ThreeUnits = 'ThreeUnits',
  FourUnits = 'FourUnits',
}

export enum uniqueDwelling {
  LogHome = 'LogHome',
  GeodesicDome = 'GeodesicDome',
  Houseboat = 'Houseboat',
  EarthShelterHome = 'EarthShelterHome',
  NA = 'NA',
}
export enum loanPurpose {
  Purchase = 'Purchase',
  RefiCashout = 'RefiCashout',
  RefiRateTermLimitedCO = 'RefiRateTermLimitedCO',
  FHAStreamlineRefi = 'FHAStreamlineRefi',
  VARateReduction = 'VARateReduction',
  SimpleRefinance = 'SimpleRefinance',
}
export enum lienType {
  First = 'First',
  RefiCashout = 'RefiCashout',
  RefiRateTermLimitedCO = 'RefiRateTermLimitedCO',
  FHAStreamlineRefi = 'FHAStreamlineRefi',
  VARateReduction = 'VARateReduction',
  SimpleRefinance = 'SimpleRefinance',
}
export enum borrowerPaidMI {
  Yes = 'Yes',
  No = 'No',
}

export enum buydown {
  None = 'None',
  ThreeTwoOne = 'ThreeTwoOne',
  TwoOne = 'TwoOne',
  OneZero = 'OneZero',
  OneOne = 'OneOne',
}
export enum automatedUnderwritingSystem {
  DU = 'DU',
  LP = 'LP',
  NotSpecified = 'NotSpecified',
  InvestorAUS = 'InvestorAUS',
  ManualTraditional = 'ManualTraditional',
}
export enum amortizationTypes {
  Fixed = 'Fixed',
  ARM = 'ARM',
  Balloon = 'Balloon',
  OptionArm = 'OptionArm',
}
export enum armFixedTerms {
  SixMonth = 'SixMonth',
  OneYear = 'OneYear',
  ThreeYear = 'ThreeYear',
  FiveYear = 'FiveYear',
  SevenYear = 'SevenYear',
  TenYear = 'TenYear',
  TwoYear = 'TwoYear',
  OneMonth = 'OneMonth',
  ThreeMonth = 'ThreeMonth',
  FifteenYear = 'FifteenYear',
  SixYear = 'SixYear',
}
export enum armSubsequentChangePeriod {
  OneYear = 'OneYear',
  SixMonth = 'SixMonth',
  ThreeYear = 'ThreeYear',
  FiveYear = 'FiveYear',
  FifteenYear = 'FifteenYear',
  OneMonth = 'OneMonth',
}

export enum feesIn {
  Yes = 'Yes',
  No = 'No',
}
export enum expandedApprovalLevel {
  NotApplicable = 'NotApplicable',
  LevelOne = 'LevelOne',
  LevelTwo = 'LevelTwo',
  LevelThree = 'LevelThree',
  LevelFour = 'LevelFour',
  LevelFive = 'LevelFive',
}
export enum loanTerms {
  ThirtyYear = 'ThirtyYear',
  TwentyFiveYear = 'TwentyFiveYear',
  TwentyYear = 'TwentyYear',
  FifteenYear = 'FifteenYear',
  TenYear = 'TenYear',
  SevenYear = 'SevenYear',

  FiveYear = 'FiveYear',
  FourYear = 'FourYear',
  TwoYear = 'TwoYear',
  ThreeMonth = 'ThreeMonth',
  SixMonth = 'SixMonth',
  NineMonth = 'NineMonth',

  ThreeYear = 'ThreeYear',
  NineYear = 'NineYear',
  EightYear = 'EightYear',
  SixYear = 'SixYear',
  OneYear = 'OneYear',
  TwelveYear = 'TwelveYear',
  NonStandardTerm = 'NonStandardTerm',
  TenYear_6_ARM = 'TenYear_6_ARM', //
  SevenYear_6_ARM = 'SevenYear_6_ARM',
  FiveYear_6_ARM = 'FiveYear_6_ARM',
}

export enum productTypes {
  StandardProducts = 'StandardProducts',
  AffordableProducts = 'AffordableProducts',
  HARP = 'HARP',
  HeroProducts = 'HeroProducts',
  StudentLoanCORefi = 'StudentLoanCORefi',
  RenovationAndRehabilitation = 'RenovationAndRehabilitation',
  BondAndHFA = 'BondAndHFA',
  HUDspecialty = 'HUDspecialty',
  USDAStreamline = 'USDAStreamline',
  NonQM = 'NonQM',
}
export enum loanType {
  Conforming = 'Conforming',
  NonConforming = 'NonConforming',
  FHA = 'FHA',
  VA = 'VA',
  AltAExpandedCriteria = 'AltAExpandedCriteria',
  Conventional = 'Conventional',
  HELOC = 'HELOC',
  USDARuralHousing = 'USDARuralHousing',
  HomeEquity = 'HomeEquity',
}
export enum historicalRatesTime {
  oneMonth = '1M',
  oneDay = '1D',
  threeDay = '3D',
  oneWeek = '1W'
  // threeMonths = '3M',
  // sixMonths = '6M',
  // oneYear = '1Y',
  // fiveMonths = '5Y',
}
export enum compensation {
  lenderPaid = 'lenderPaid',
  borrowerPaid = 'borrowerPaid',
}

export enum prepaymentPenalty {
  None = 'None',
  OneYear = 'OneYear',
  TwoYear = 'TwoYear',
  ThreeYear = 'ThreeYear',
  FourYear = 'FourYear',
  FiveYear = 'FiveYear',
}

export enum includeLOCompensationInPricing {
  YesLenderPaid = 'YesLenderPaid',
  NoBuyerPaid = 'NoBuyerPaid',
  NoLenderPaid = 'NoLenderPaid',
}

export enum assetDepletion {
  Yes = 'Yes',
  No = 'No',
}
export enum autoDebit {
  Yes = 'Yes',
  No = 'No',
}
export enum employeeLoan {
  Yes = 'Yes',
  No = 'No',
}
export enum communityAffordableSecond {
  Yes = 'Yes',
  No = 'No',
}

export enum expandedGuidelines {
  FullDoc = 'FullDoc',
  PersonalBankStmt1Mo = 'PersonalBankStmt1Mo',
  PersonalBankStmt6Mos = 'PersonalBankStmt6Mos',
  PersonalBankStmt12Mos = 'PersonalBankStmt12Mos',
  PersonalBankStmt18Mos = 'PersonalBankStmt18Mos',
  PersonalBankStmt24Mos = 'PersonalBankStmt24Mos',
  BusinessBankStmt1Mo = 'BusinessBankStmt1Mo',
  BusinessBankStmt6Mos = 'BusinessBankStmt6Mos',
  BusinessBankStmt12Mos = 'BusinessBankStmt12Mos',
  BusinessBankStmt18Mos = 'BusinessBankStmt18Mos',
  BusinessBankStmt24Mos = 'BusinessBankStmt24Mos',
  OneYearAltDoc = 'OneYearAltDoc',
  AssetRelated = 'AssetRelated',
  InvestorDscr = 'InvestorDscr',
  RestrictedStock = 'RestrictedStock',
  TwoYearAltDoc = 'TwoYearAltDoc',
  WrittenVOE = 'WrittenVOE',
  Stated = 'Stated',
  OneYear1099 = 'OneYear1099',
  TwoYear1099 = 'TwoYear1099',
  PLOneYear = 'PLOneYear',
  PLTwoYear = 'PLTwoYear',
  NoIncomeVerification = 'NoIncomeVerification',
}

export enum housingEventType {
  None = 'None',
  DeedInLieu = 'DeedInLieu',
  Foreclosure = 'Foreclosure',
  Modification = 'Modification',
  ShortSale = 'ShortSale',
  Forbearance = 'Forbearance',
}

export enum housingEventSeasoning {
  NotApplicable = 'NotApplicable',
  Last1To12Months = 'Last1To12Months',
  Last13To24Months = 'Last13To24Months',
  Last25To36Months = 'Last25To36Months',
  Last37To48Months = 'Last37To48Months',
  Last49To60Months = 'Last49To60Months',
  MoreThanFiveYearsAgo = 'MoreThanFiveYearsAgo',
}

export enum bankruptcyType {
  None = 'None',
  Chapter7 = 'Chapter7',
  Chapter11 = 'Chapter11',
  Chapter13 = 'Chapter13',
}

export enum bankruptcyOutcome {
  NotApplicable = 'NotApplicable',
  Discharged = 'Discharged',
  Dismissed = 'Dismissed',
  OpenOrPending = 'OpenOrPending',
}

export enum bankruptcySeasoning {
  NotApplicable = 'NotApplicable',
  Last1To12Months = 'Last1To12Months',
  Last13To24Months = 'Last13To24Months',
  Last25To36Months = 'Last25To36Months',
  Last37To48Months = 'Last37To48Months',
  Last49To60Months = 'Last49To60Months',
  MoreThanFiveYearsAgo = 'MoreThanFiveYearsAgo',
}

export enum constructionLoanType {
  NotApplicable = 'NotApplicable',
  Construction = 'Construction',
  ConstructionToPerm = 'ConstructionToPerm',
}

export enum QUESTION_TYPE {
  INPUT = 'input',
  SELECT = 'select',
  SLIDER = 'slider',
}
export enum LOAN_OPTION {
  PURCHASE = 'purchase',
  REFINANCE = 'refinance',
  CASHOUT = 'cashout',
}

export const propertyTypeLabel = [
  {
    label: 'Single Family',
    value: propertyType.SingleFamily,
    unitName: 1,
    unitValue: 'OneUnit',
  },
  {
    label: 'Condominium',
    value: propertyType.Condo,
    unitName: 1,
    unitValue: 'OneUnit',
  },
  {
    label: 'Manufactured Double Wide',
    value: propertyType.ManufacturedDoubleWide,
    unitName: 2,
    unitValue: 'TwoUnits',
  },
  {
    label: 'Condotel',
    value: propertyType.Condotel,
    unitName: 1,
    unitValue: 'OneUnit',
  },
  {
    label: 'Modular',
    value: propertyType.Modular,
    unitName: 1,
    unitValue: 'OneUnit',
  },
  {
    label: 'PUD',
    value: propertyType.PUD,
    unitName: 1,
    unitValue: 'OneUnit',
  },
  {
    label: 'Timesharer',
    value: propertyType.Timesharer,
    unitName: 1,
    unitValue: 'OneUnit',
  },
  {
    label: 'Manufactured Single Wide',
    value: propertyType.ManufacturedSingleWide,
    unitName: 1,
    unitValue: 'OneUnit',
  },
  {
    label: 'Coop',
    value: propertyType.Coop,
    unitName: 1,
    unitValue: 'OneUnit',
  },
  {
    label: 'Non Warrantable Condo',
    value: propertyType.NonWarrantableCondo,
    unitName: 1,
    unitValue: 'OneUnit',
  },
  {
    label: 'Townhouse',
    value: propertyType.Townhouse,
    unitName: 1,
    unitValue: 'OneUnit',
  },
  {
    label: 'Detached Condo',
    value: propertyType.DetachedCondo,
    unitName: 1,
    unitValue: 'OneUnit',
  },
];
export const occupancyTypeLabel = [
  {
    label: 'Investment Property',
    value: occupancy.InvestmentProperty,
  },
  {
    label: 'Primary Residence',
    value: occupancy.PrimaryResidence,
  },
  {
    label: 'Second Home',
    value: occupancy.SecondHome,
  },
];
export const compensationLabel = [
  {
    label: 'Lender Paid',
    value: 'lenderPaid',
  },
  {
    label: 'Borrower Paid',
    value: 'borrowerPaid',
  },
];
export const loanTypeLabel = [
  {
    label: 'Conforming',
    value: loanType.Conforming,
    primaryType: loanType.Conventional,
  },
  {
    label: 'Non-Conforming',
    value: loanType.NonConforming,
    primaryType: loanType.Conventional,
  },

  {
    label: 'FHA',
    value: loanType.FHA,
    primaryType: loanType.FHA,
  },
  {
    label: 'VA',
    value: loanType.VA,
    primaryType: loanType.VA,
  },
  // {
  //   label: 'Alt A Expanded Criteria',
  //   value: loanType.AltAExpandedCriteria,
  // },
  {
    label: 'Conventional',
    value: loanType.Conventional,
    primaryType: loanType.Conventional,
  },
  {
    label: 'HELOC',
    value: loanType.HELOC,
    primaryType: loanType.VA,
  },
  {
    label: 'USDA Rural Housing',
    value: loanType.USDARuralHousing,
    primaryType: loanType.VA,
  },
  // {
  //   label: 'Home Equity',
  //   value: loanType.HomeEquity,
  // },
];
export const loanPurposeLabel = [
  {
    label: 'Purchase',
    value: loanPurpose.Purchase,
  },
  {
    label: 'Cashout Refinance',
    value: loanPurpose.RefiCashout,
  },
  // {
  //   label: 'Refi Rate Term Limited CO',
  //   value: loanPurpose.RefiRateTermLimitedCO,
  // },
  // {
  //   label: 'FHA Stream line Refi',
  //   value: loanPurpose.FHAStreamlineRefi,
  // },
  // {
  //   label: 'VA Rate Reduction',
  //   value: loanPurpose.VARateReduction,
  // },
  {
    label: 'Limited Cashout Refinance',
    value: loanPurpose.RefiRateTermLimitedCO,
  },
];
export const creditScoreLabel = [
  {
    label: '500 - 539 (Very Poor)',
    value: 539,
  },
  {
    label: '540 - 559 (Very Poor)',
    value: 559,
  },
  {
    label: '560 - 579 (Very Poor)',
    value: 579,
  },
  {
    label: '580 - 599 (Very Poor)',
    value: 599,
  },
  {
    label: '600 - 619 (Very Poor)',
    value: 619,
  },
  {
    label: '620 - 639 (Poor)',
    value: 639,
  },
  {
    label: '640 - 659 (Poor)',
    value: 659,
  },
  {
    label: '660 - 679 (Fair)',
    value: 679,
  },
  {
    label: '680 - 699 (Fair)',
    value: 699,
  },
  {
    label: '700 - 719 (Good)',
    value: 719,
  },
  {
    label: '720 - 739 (Great)',
    value: 739,
  },
  {
    label: '740 - 759 (Excellent)',
    value: 759,
  },
  {
    label: '760 - 779 (Excellent)',
    value: 779,
  },
  {
    label: '780 - 799 (Excellent)',
    value: 799,
  },
  {
    label: '800 or higher (Excellent)',
    value: 800,
  },
  {
    label: 'No credit',
    value: 0,
  },
];
export const vaServiceTypeLabel = [
  {
    label: 'Active Duty',
    value: vaServiceType.ActiveDuty,
  },
  {
    label: 'National Guard Or Reserves',
    value: vaServiceType.NationalGuardOrReserves,
  },
];
export const vaUseTypeLabel = [
  {
    label: 'First Time Use',
    value: vaUseType.FirstTimeUse,
  },
  {
    label: 'Subsequent Use',
    value: vaUseType.SubsequentUse,
  },
];

export const loanTermsLabel = [
  {
    label: '30-Year Fixed',
    value: loanTerms.ThirtyYear,
    formValue: 30
  },
  // {
  //   label: '25-Year Fixed',
  //   value: loanTerms.TwentyFiveYear,
  //   formValue: 25,
  // },
  {
    label: '20-Year Fixed',
    value: loanTerms.TwentyYear,
  },
  {
    label: '15-Year Fixed',
    value: loanTerms.FifteenYear,
    formValue: 15,
  },
  // {
  //   label: '5-Year Fixed',
  //   value: loanTerms.FiveYear,
  //   formValue: 5,
  // },
  {
    label: '5/6 ARM',
    value: 'FiveYear_6_ARM',
    formValue: 30
  },
  {
    label: '10/6 ARM',
    value: 'TenYear_6_ARM',
    formValue: 30
  },
  {
    label: '7/6 ARM',
    value: 'SevenYear_6_ARM',
    formValue: 30
  },

  // {
  //   label: '10-Yr Fixed',
  //   value: loanTerms.TenYear,
  // },
  // {
  //   label: '5-Yr Fixed',
  //   value: loanTerms.FiveYear,
  // },
  // {
  //   label: '3-Mon Fixed',
  //   value: loanTerms.ThreeMonth,
  // },
  // {
  //   label: '6-Mon Fixed',
  //   value: loanTerms.SixMonth,
  // },
  // {
  //   label: '9-Mon Fixed',
  //   value: loanTerms.NineMonth,
  // },
];
export const vaFundingFeeLabel = [
  {
    label: 'Financed',
    value: true,
  },
  {
    label: 'Not Financed',
    value: false,
  },
];
export const vaDisabilityStatusLabel = [
  {
    label: 'N/A',
    value: true,
  },
  {
    label: 'Currently receiving',
    value: false,
  },
];
export const upFrontMIPLabel = [
  {
    label: 'Financed',
    value: true,
  },
  {
    label: 'Not Financed',
    value: false,
  },
];

export const loanTermsCalculatorLabel = [
  {
    label: '30 years',
    value: 30,
  },
  {
    label: '25 years',
    value: 25,
  },
  {
    label: '20 years',
    value: 20,
  },
  {
    label: '15 years',
    value: 15,
  },
  {
    label: '10 years',
    value: 10,
  },
  {
    label: '7 years',
    value: 7,
  },
  {
    label: '5 years',
    value: 5,
  },
];

export const generateRandomKey = (length) => {
  return (crypto.randomBytes(4).readUInt32BE() / 2 ** 32).toString().slice(2, length + 2);
};

export const generateRandomStringKey = () => {
  return uuidv4();
};

export enum WEBSITE_CONFIG_TYPE {
  url = 'url',
}

export enum AGENCY_ROLE {
  LOAN_OFFICER = 'Loan Officer',
  LOAN_PROCESSOR = 'Loan Processor',
  REAL_ESTATE_AGENT = 'Real Estate Agent',
  REALTOR = 'Realtor'
}

export enum AGENCY_STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  LOCKED = 'LOCKED',
}

export enum AGENCY_APPLY_FOR {
  PERSONAL_WEBSITE_AND_DETAIL_PAGE = 'Personal website and detail page',
  DETAIL_PAGE = 'Detail page',
}

export enum AGENCY_THEME {
  pacificwideTheme = 'pacificwideTheme',
  blueBrandTheme = 'blueBrandTheme',
  greenBrandTheme = 'greenBrandTheme',
  yellowBrandTheme = 'yellowBrandTheme',
}

export enum AGENCY_TEMPLATE {
  AGENCY_TEMPLATE_1 = 'agentTemplate',
  AGENCY_TEMPLATE_2 = 'pacificTemplate',
}

export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum ACCOUNT_STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  LOCKED = 'LOCKED',
}

export enum GENDER {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  NONE = 'NONE',
}

export enum LEAD_SOURCE_TYPE {
  AGENT = 'AGENT',
  TEAM_AGENT = 'TEAM_AGENT',
  PACIFICWIDE = 'PACIFICWIDE',
}

export enum LEAD_SOURCE {
  WEBSITE = 'WEBSITE',
  REFERRAL = 'REFERRAL',
  ADVERTISEMENT = 'ADVERTISEMENT',
  MANUAL = 'MANUAL',
}
export enum LEAD_TYPE {
  SELLER = 'SELLER',
  BUYER = 'BUYER',
}

export enum STATUS {
  NEW = 'NEW',
  PRIME = "PRIME",
  PENDING = "PENDING",
  ARCHIVED = "ARCHIVED",
  CLOSE = "CLOSE",
  JUNK = "JUNK",
  DO_NOT_CONTACT = "DO_NOT_CONTACT",
  BLOCKED = "BLOCKED"
}

export enum AGENCY_REVIEW_STATUS {
  PUBLISH = 'PUBLISH',
  HIDE = 'HIDE',
  PENDING = 'PENDING',
}

export enum AGENCY_REVIEW_SOURCE_DEFAULT {
  WEBSITE = 'agent_website',
}

export enum SHARE_ME_RATE_TYPE {
  DEFAULT = 0,
  CUSTOMIZE = 1,
}

export const ERR_MSG_FORMAT_PASSWORD = 'The password is in the wrong format. Please re-enter your password. ';

export type TAuthenticationUserInfo = {
  id: string;
  userName: string;
  primaryPhone: null | string;
  firstName: string;
  lastName: string;
  roles: string[];
  email: string;
  createdAt: string;
  updatedAt: string;
  imagePath: null | string;
  resetPasswordDefaut?: boolean;
  keyResetPasswordDefaut?: string;
};


export type RolePermission = {
  create?: boolean;
  delete?: boolean;
  update?: boolean;
  view?: boolean;
};
export type TAuthenticationJWT = {
  roles: string[];
  email: string;
  verifyType: TypeVerifyPhone;
  accessToken?: string;
  refreshToken?: string;
  user?: AdminProfile;
  rolePermission?: {
    agency: RolePermission;
    teamAgency: RolePermission;
  };
};

export type TypeVerifyPhone = 'sms' | 'voice' | 'email';


export enum StatusFlowPreQualification {
  INPROGRESS = 'INPROGRESS',
  COMPLETE = 'COMPLETE',
}


