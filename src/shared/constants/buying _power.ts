
function calculate_monthly_payment(data: {
  annual_income: number,
  monthly_debt: number,
  down_payment: number,
  hoa: number,
  home_insurance: number,
  other_fees: number,
  DTI: number,
  loan_type: string, // VA, FHA, Standard
  interest_rate: number,
  loan_term: number,
  property_tax_percent: number,
  pmi_percentage: number,
}) {

  let adjusted_max_mortgage, down_payment_percent, est_property_value, monthly_pmi, monthly_property_tax, principal_loan_amount;
  const annual_income = data.annual_income;
  const monthly_income = annual_income / 12;
  const monthly_debt = data.monthly_debt;
  const down_payment = data.down_payment;
  const hoa = data.hoa;
  const home_insurance = data.home_insurance;
  const other_fees = data.other_fees;
  const DTI = data.DTI;
  const dti_ratio = DTI / 100;
  const loan_type = data.loan_type;
  const interest_rate = data.interest_rate;
  const loan_term = data.loan_term;
  const property_tax_percent = data.property_tax_percent;
  const pmi_percentage = data.pmi_percentage;
  const monthly_interest_rate = interest_rate / 12 / 100;
  const total_payments = loan_term * 12;
  const monthly_mortgage_debt = monthly_income * dti_ratio - monthly_debt - hoa - home_insurance - other_fees;
  principal_loan_amount = monthly_mortgage_debt * (1 - Math.pow(1 + monthly_interest_rate, -total_payments)) / monthly_interest_rate;
  est_property_value = principal_loan_amount + down_payment;
  down_payment_percent = down_payment / est_property_value * 100;

  if (down_payment_percent < 20 && loan_type === "Standard") {
    monthly_property_tax = est_property_value * (property_tax_percent / 12);
    console.log('monthly_property_tax', monthly_property_tax);
    monthly_pmi = principal_loan_amount * pmi_percentage / 12;
    console.log('monthly_pmi', monthly_pmi);
    adjusted_max_mortgage = monthly_mortgage_debt - monthly_property_tax - monthly_pmi;
    console.log('adjusted_max_mortgage', adjusted_max_mortgage);
    principal_loan_amount = adjusted_max_mortgage * (1 - Math.pow(1 + monthly_interest_rate, -total_payments)) / monthly_interest_rate;
    console.log('principal_loan_amount', principal_loan_amount);
    est_property_value = principal_loan_amount + down_payment;
    console.log('est_property_value', est_property_value);
    down_payment_percent = down_payment / est_property_value * 100;
    console.log('down_payment_percent', down_payment_percent);
    console.log("Home Value:", est_property_value);
    console.log("Down Payment Percentage:", down_payment_percent);
    console.log("Monthly Payment:", monthly_mortgage_debt);
    console.log("PMI included, Down Payment < 20%");
  } else {
    monthly_property_tax = est_property_value * (property_tax_percent / 12);
    adjusted_max_mortgage = monthly_mortgage_debt - monthly_property_tax;
    console.log("Home Value:", est_property_value);
    console.log("Down Payment Percentage:", down_payment_percent);
    console.log("Monthly Payment:", monthly_mortgage_debt);

    if (down_payment_percent >= 20) {
      console.log("No PMI required, Down Payment \u2265 20%");
    } else {
      console.log("Loan type not Standard, no PMI calculation");
    }
  }
}

calculate_monthly_payment({
  annual_income: 70000,
  monthly_debt: 250,
  down_payment: 20000,
  hoa: 0,
  home_insurance: 945,
  other_fees: 0,
  DTI: 50,
  loan_type: "Standard", // VA, FHA, Standard
  interest_rate: 7,
  loan_term: 30,
  property_tax_percent: 0.0125,
  pmi_percentage: 0.0075
});
