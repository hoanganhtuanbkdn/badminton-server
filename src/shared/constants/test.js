// console.log(
//   'xxx',
//   xxx.map((x) => {
//     return {
//       investor: x.investor.split(' - ')[0],
//       rate: x.rate,
//       price: x.price,
//     };
//   }),
// );
// console.log(rawData.length);
// const PIVOT = 100;
// const PPE_LIMIT = 10;

// const rawDataSorted = sortBy(rawData, [
//   function (o) {
//     return Math.abs(o.price - PIVOT);
//   },
// ]);
// console.log(
//   'rawDataSorted',
//   rawDataSorted.map((x) => {
//     return {
//       investor: x.investor.split(' - ')[0],
//       rate: x.rate,
//     };
//   }),
// );
// const rawDataUniqBy = uniqBy(rawDataSorted, function (o) {
//   return o.rate;
// });
// console.log(
//   'rawDataUniqBy',
//   rawDataUniqBy.map((x) => {
//     return {
//       investor: x.investor.split(' - ')[0],
//       rate: x.rate,
//     };
//   }),
// );

// if (rawData.length <= PPE_LIMIT) {
//   return sortBy(
//     rawDataUniqBy.map((item) => {
//       return {
//         rate: round(item.rate, 4),
//         apr: round(item.apr, 4),
//         investor: item.investor.split(' - ')[0],
//         credit: round((totalLoanAmount * (PIVOT - item.price)) / 100, 4),
//         point: round(PIVOT - item.price, 4),
//         closingCost: round(item.closingCost, 4),
//         payment: round(item.totalPayment, 4),
//         lastUpdate: item.lastUpdate,
//         price: round(item.price, 4),
//         principalAndInterest: round(item.principalAndInterest, 4),
//         productId: item.productId,
//         productName: item.productName,
//         id: item.productId,
//       };
//     }),
//     ['rate', 'price'],
//   );
// } else {
//   return sortBy(
//     rawDataUniqBy.slice(0, PPE_LIMIT).map((item) => {
//       return {
//         rate: round(item.rate, 4),
//         apr: round(item.apr, 4),
//         investor: item.investor.split(' - ')[0],
//         credit: round((totalLoanAmount * (PIVOT - item.price)) / 100, 4),
//         point: round(PIVOT - item.price, 4),
//         closingCost: round(item.closingCost, 4),
//         payment: round(item.totalPayment, 4),
//         lastUpdate: item.lastUpdate,
//         price: round(item.price, 4),
//         principalAndInterest: round(item.principalAndInterest, 4),
//         productId: item.productId,
//         productName: item.productName,
//         id: item.productId,
//       };
//     }),
//     ['rate', 'price'],
//   );
// }

// // console.log(a['products'].map((x) => x.rate));
// // const test = [
// //   0.25, 0.75, 0.5, 0.25, 0.25, 0.5, 1.0, 1.0, 0.5, 0.25, 0.1875, 0.125, 0.0625, 0.0625, 0.0625, 0.0625, 0.0625, 0.0625,
// //   1.0, 0.0625, 0.0625, 0.0625, 0.0625, 0.0625, 0.0625, 0.1875, 0.4375, 0.0625, 0.1875, 0.0625, 0.0625, 0.3125, 0.0625,
// //   0.0625, 0.0625, 0.0625, 0.0625, 0.125, 0.125, 0.0625, 0.125, 0.0625, 0.0625, 0.0625, 0.1875, 0.0625, 0.0625, 0.125,
// //   0.125, 0.0625, 0.125, 0.0625, 0.0625, 0.0625, 0.125, 0.125, 0.0625, 0.375, 0.0625, 0.125, 0.125, 0.4375,
// // ];
// // let sum = 0;
// // test.forEach((num) => {
// //   sum = sum + num;
// // });
// // console.log('sum', sum);
// // console.log('result', 12 - sum);

// import * as numjs from 'numjs';
// import { arange, array, append } from 'numjs';

// npm i numjs
// eslint-disable-next-line @typescript-eslint/no-var-requires
let numjs = require('numjs');

// import * as numjs from 'numpy';
let break_even_point_in_months,
  cash_out_refinance,
  closing_costs,
  current_interest_rate,
  first_value,
  home_value,
  interest_difference,
  last_value,
  monthly_savings,
  months,
  months_elapsed,
  months_paid,
  new_interest_rate,
  new_loan_term,
  new_monthly_payment,
  new_total_interest,
  next_value,
  old_monthly_payment,
  old_total_interest,
  original_loan_amount,
  original_loan_term,
  remaining_balance,
  remaining_term,
  remaining_term_in_months,
  remaining_term_in_years,
  total_savings,
  years;

function calculate_monthly_payment(principal, annual_interest_rate, term_in_years) {
  let monthly_interest_rate, monthly_payment, number_of_payments;
  monthly_interest_rate = annual_interest_rate / 12 / 100;
  number_of_payments = term_in_years * 12;
  monthly_payment =
    (principal * monthly_interest_rate * Math.pow(1 + monthly_interest_rate, number_of_payments)) /
    (Math.pow(1 + monthly_interest_rate, number_of_payments) - 1);
  return monthly_payment;
}

function calculate_total_interest(principal, annual_interest_rate, term_in_years) {
  let monthly_payment, total_interest, total_payment_over_life;
  monthly_payment = calculate_monthly_payment(principal, annual_interest_rate, term_in_years);
  total_payment_over_life = monthly_payment * term_in_years * 12;
  total_interest = total_payment_over_life - principal;
  return total_interest;
}

function remaining_loan_balance(principal, annual_interest_rate, term_in_years, months_paid) {
  let monthly_interest_rate;
  monthly_interest_rate = annual_interest_rate / 12 / 100;
  remaining_balance =
    (principal *
      (Math.pow(1 + monthly_interest_rate, term_in_years * 12) - Math.pow(1 + monthly_interest_rate, months_paid))) /
    (Math.pow(1 + monthly_interest_rate, term_in_years * 12) - 1);
  return remaining_balance;
}

function calculate_break_even(old_monthly_payment, new_monthly_payment, closing_costs) {
  monthly_savings = old_monthly_payment - new_monthly_payment;

  if (monthly_savings <= 0) {
    return null;
  }

  break_even_point_in_months = closing_costs / monthly_savings;
  return break_even_point_in_months;
}

function calculate_savings(months_elapsed, monthly_savings) {
  return months_elapsed * monthly_savings;
}

original_loan_amount = Number.parseFloat(1000000);
original_loan_term = Number.parseInt(30);
current_interest_rate = Number.parseFloat(5);
remaining_term = Number.parseInt(10);
remaining_term_in_months = Number.parseInt(6);
new_interest_rate = Number.parseFloat(4);
new_loan_term = Number.parseInt(10);
// cash_out_refinance = input('Cash out refinance (yes or no): ').lower();
cash_out_refinance = 'no';
// home_value = cash_out_refinance === 'yes' ? Number.parseFloat(input('Enter the home value: $')) : 0;
home_value = 0;
// closing_costs =
//   cash_out_refinance === 'yes' ? Number.parseFloat(input('Enter the closing costs: $')) : original_loan_amount * 0.01;
closing_costs = original_loan_amount * 0.01;

remaining_term_in_years = original_loan_term - (remaining_term + remaining_term_in_months / 12);
months_paid = remaining_term_in_years * 12;
remaining_balance = remaining_loan_balance(
  original_loan_amount,
  current_interest_rate,
  original_loan_term,
  months_paid,
);
old_monthly_payment = calculate_monthly_payment(original_loan_amount, current_interest_rate, original_loan_term);
new_monthly_payment = calculate_monthly_payment(remaining_balance, new_interest_rate, new_loan_term);
old_total_interest = calculate_total_interest(remaining_balance, current_interest_rate, remaining_term);
new_total_interest = calculate_total_interest(remaining_balance, new_interest_rate, new_loan_term);
break_even_point_in_months = calculate_break_even(old_monthly_payment, new_monthly_payment, closing_costs);
monthly_savings = old_monthly_payment - new_monthly_payment;
interest_difference = new_total_interest - old_total_interest;
console.log('Old PM', old_monthly_payment);
console.log('New PM', new_monthly_payment);

if (break_even_point_in_months === null) {
  console.log('There is no break-even point because the new loan does not reduce the monthly payment.');
} else {
  if (break_even_point_in_months > 12) {
    years = break_even_point_in_months / 12;
    months = break_even_point_in_months % 12;
    // [years, months] = divmod(break_even_point_in_months, 12);
    months = Math.round(months);
    if (months === 12) {
      months = 0;
      years += 1;
    }

    console.log(`Break even in ${Number.parseInt(years)} year(s) and ${Number.parseInt(months)} month(s).`);
  } else {
    console.log(`Break even in ${round(break_even_point_in_months)} month(s).`);
  }
}

months_elapsed = numjs.arange(1, new_loan_term * 12 + 1, 1);
total_savings = [];
first_value = -break_even_point_in_months * monthly_savings;
total_savings.push(first_value);

for (let i = 1, _pj_a = remaining_term * 12; i < _pj_a; i += 1) {
  next_value = first_value + i * monthly_savings;
  total_savings.push(next_value);
}

total_savings = numjs.array(total_savings);

for (let i = 1, _pj_a = (new_loan_term - remaining_term) * 12 + 1; i < _pj_a; i += 1) {
  last_value = total_savings.slice(-1)[0];
  next_value = last_value - new_monthly_payment;
  total_savings = numjs.append(total_savings, next_value);
}
