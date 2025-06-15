// App.js
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Select } from "./components/ui/select";
import { calculatePayoffSchedule } from "./utils/payoffCalculator";
import './App.css';

function App() {
  const [debts, setDebts] = useState([]);
  const [budget, setBudget] = useState(1000);
  const [strategy, setStrategy] = useState("avalanche");
  const [result, setResult] = useState(null);
  const [newDebt, setNewDebt] = useState({
    name: "",
    balance: "",
    rate: "",
    minPayment: "",
  });

  useEffect(() => {
    if (debts.length > 0) {
      const res = calculatePayoffSchedule(debts, budget, strategy);
      setResult(res);
    }
  }, [debts, budget, strategy]);

  const handleDebtChange = (e) => {
    const { name, value } = e.target;
    setNewDebt((prev) => ({ ...prev, [name]: value }));
  };

  const addDebt = () => {
    const { name, balance, rate, minPayment } = newDebt;
    if (!name || !balance || !rate || !minPayment) return;
    const id = debts.length + 1;
    setDebts((prev) => [
      ...prev,
      {
        id,
        name,
        balance: parseFloat(balance),
        rate: parseFloat(rate),
        minPayment: parseFloat(minPayment),
      },
    ]);
    setNewDebt({ name: "", balance: "", rate: "", minPayment: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardContent>
            <h1 className="text-3xl font-bold mb-4 text-indigo-700">Debt Payoff Calculator</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Monthly Budget ($)</label>
                <Input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Payoff Strategy</label>
                <Select value={strategy} onChange={(e) => setStrategy(e.target.value)}>
                  <option value="avalanche">Avalanche (High Interest First)</option>
                  <option value="snowball">Snowball (Smallest Balance First)</option>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Add a New Debt</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Debt Name"
                name="name"
                value={newDebt.name}
                onChange={handleDebtChange}
              />
              <Input
                type="number"
                placeholder="Balance"
                name="balance"
                value={newDebt.balance}
                onChange={handleDebtChange}
              />
              <Input
                type="number"
                placeholder="Interest Rate (%)"
                name="rate"
                value={newDebt.rate}
                onChange={handleDebtChange}
              />
              <Input
                type="number"
                placeholder="Min Payment"
                name="minPayment"
                value={newDebt.minPayment}
                onChange={handleDebtChange}
              />
            </div>
            <button
              onClick={addDebt}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700"
            >
              Add Debt
            </button>
          </CardContent>
        </Card>

        {debts.length > 0 && (
          <Card className="bg-white rounded-xl shadow-md p-6">
            <CardContent>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 tracking-wide">Debts</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-pink-200 text-pink-900 uppercase tracking-wider">
                      <th className="border border-gray-300 px-4 py-3 text-left">Name</th>
                      <th className="border border-gray-300 px-4 py-3 text-right">Balance ($)</th>
                      <th className="border border-gray-300 px-4 py-3 text-right">Interest Rate (%)</th>
                      <th className="border border-gray-300 px-4 py-3 text-right">Min Payment ($)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {debts.map((d, i) => (
                      <tr
                        key={d.id}
                        className={i % 2 === 0 ? "bg-lavender-50" : "bg-white"}
                      >
                        <td className="border border-gray-300 px-4 py-2 font-medium text-gray-700">{d.name}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right text-gray-800">
                          ${d.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-right text-gray-800">
                          {(d.rate * 100).toFixed(2)}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-right text-gray-800">
                          ${d.minPayment.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {result && (
          <Card>
            <CardContent>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Payoff Summary</h2>
              <p className="text-gray-700"><strong>Months to Pay Off:</strong> {result.months}</p>
              <p className="text-gray-700"><strong>Total Interest Paid:</strong> ${result.totalInterest.toLocaleString()}</p>

              <div className="mt-6">
                <h3 className="text-lg font-medium text-indigo-600 mb-2">First Month Payments</h3>
                <ul className="divide-y divide-gray-200">
                  {result.schedule[0].payments.map(p => (
                    <li key={p.id} className="py-2 text-sm text-gray-700">
                      <span className="font-semibold text-gray-800">{p.name}:</span> Payment ${p.payment.toFixed(2)} | Interest ${p.interest.toFixed(2)} | Remaining ${p.remaining.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default App;
