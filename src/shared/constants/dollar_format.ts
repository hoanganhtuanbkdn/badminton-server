export const dollarFormat = (dollar) => {
  // const dollarUSLocale = Intl.NumberFormat('en-US');
  // return dollarUSLocale.format(Number(dollar));

  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(dollar);
};
