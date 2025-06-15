// utils/payoffCalculator.js
export function calculatePayoffSchedule(debts, budget, strategy = "avalanche") {
  const schedule = [];
  const debtList = debts.map(d => ({ ...d })); // clone

  // Sort debts based on strategy
  const sortDebts = () => {
    if (strategy === "avalanche") {
      debtList.sort((a, b) => b.rate - a.rate);
    } else if (strategy === "snowball") {
      debtList.sort((a, b) => a.balance - b.balance);
    }
  };

  let month = 0;
  let totalInterest = 0;

  while (debtList.some(d => d.balance > 0)) {
    sortDebts();

    // Calculate minimums and extra budget
    const minSum = debtList.reduce(
      (sum, d) => sum + (d.balance > 0 ? d.minPayment : 0),
      0
    );

    const extra = Math.max(0, budget - minSum);
    const payments = [];

    let extraLeft = extra;

    for (const debt of debtList) {
      if (debt.balance <= 0) {
        payments.push({ id: debt.id, name: debt.name, payment: 0, interest: 0 });
        continue;
      }

      const monthlyInterest = (debt.balance * debt.rate) / 12;
      totalInterest += monthlyInterest;

      let payment = debt.minPayment + 0;

      // Allocate extra to the top-priority debt
      if (extraLeft > 0 && debt === debtList[0]) {
        const maxExtra = debt.balance + monthlyInterest - payment;
        const extraPayment = Math.min(extraLeft, maxExtra);
        payment += extraPayment;
        extraLeft -= extraPayment;
      }

      const principalPayment = Math.max(0, payment - monthlyInterest);
      debt.balance = Math.max(0, debt.balance - principalPayment);

      payments.push({
        id: debt.id,
        name: debt.name,
        payment: parseFloat(payment.toFixed(2)),
        interest: parseFloat(monthlyInterest.toFixed(2)),
        remaining: parseFloat(debt.balance.toFixed(2)),
      });
    }

    schedule.push({ month, payments });
    month++;
    if (month > 600) break; // Prevent infinite loop
  }

  return {
    months: month,
    totalInterest: parseFloat(totalInterest.toFixed(2)),
    schedule,
  };
}
