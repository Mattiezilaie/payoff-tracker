import { calculatePayoffSchedule } from './utils/payoffCalculator';

const debts = [
  { id: 1, name: "Credit Card A", balance: 3000, rate: 0.24, minPayment: 100 },
  { id: 2, name: "Car Loan", balance: 10000, rate: 0.07, minPayment: 250 },
];

const result = calculatePayoffSchedule(debts, 1000, "avalanche");

console.log("Months:", result.months);
console.log("Total Interest Paid:", result.totalInterest);
console.log("First 3 Months of Schedule:", result.schedule.slice(0, 3));
