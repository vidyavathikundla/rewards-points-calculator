import  { useState, useEffect } from "react";
import './App.css';

const MIN_TRANSACTION_AMT = 50;
const MAX_TRANSACTION_AMT = 100;


const fetchData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = [
        {
          customerId: 1,
          transactionAmount: 120,
          transactionDate: "2023-08-15"
        },
        {
          customerId: 1,
          transactionAmount: 120,
          transactionDate: "2023-08-15"
        },
       {
          customerId: 1,
          transactionAmount: 120,
          transactionDate: "2023-09-12"
        },
        {
          customerId: 1,
          transactionAmount: 120,
          transactionDate: "2023-10-17"
        },
        { customerId: 1, transactionAmount: 75, transactionDate: "2023-08-20" },
        { customerId: 2, transactionAmount: 50, transactionDate: "2023-08-10" },
        {
          customerId: 2,
          transactionAmount: 120,
          transactionDate: "2023-08-15"
        },
        {
          customerId: 2,
          transactionAmount: 167,
          transactionDate: "2023-08-15"
        },
        {
          customerId: 2,
          transactionAmount: 2000,
          transactionDate: "2023-09-12"
        },
        {
          customerId: 1,
          transactionAmount: 237,
          transactionDate: "2023-10-17"
        },
        { customerId: 2, transactionAmount: 12, transactionDate: "2023-08-20" }
      ];
      resolve(data);
    }, 1000);
  });
};



const calculateRewards = (transactionAmount) => {
  let points = 0;
  if (transactionAmount > MAX_TRANSACTION_AMT) {
    points += (transactionAmount - MAX_TRANSACTION_AMT) * 2;
    points += MIN_TRANSACTION_AMT;
  } else if (transactionAmount > MIN_TRANSACTION_AMT) {
    points += transactionAmount - MIN_TRANSACTION_AMT;
  }
  return points;
};

const App = () => {
  const [customerData, setCustomerData] = useState([]);

  useEffect(() => {
    const fetchDataAsync = async () => {
      const data = await fetchData();
      setCustomerData(data);
    };

    fetchDataAsync();
  }, []);

  const calculateMonthlyRewards = () => {
    const monthlyRewards = {};

    customerData.forEach((transaction) => {
      const { customerId, transactionDate, transactionAmount } = transaction;
      const transactionMonth = new Date(
        transactionDate
      ).toLocaleDateString("en-US", { year: "numeric", month: "numeric" });

      if (!monthlyRewards[customerId]) {
        monthlyRewards[customerId] = {};
      }

      if (!monthlyRewards[customerId][transactionMonth]) {
        monthlyRewards[customerId][transactionMonth] = 0;
      }

      monthlyRewards[customerId][transactionMonth] += calculateRewards(
        transactionAmount
      );
    });

    return monthlyRewards;
  };

  const monthlyRewards = calculateMonthlyRewards();

  const months = [
    ...new Set(Object.values(monthlyRewards).flatMap(Object.keys)),
  ];


const calculateTotalRewardsForThreeMonths = () => {
  const totalRewards = {};

  Object.keys(monthlyRewards).forEach((customerId) => {
    totalRewards[customerId] = Object.values(monthlyRewards[customerId]).reduce((total, rewards) => {
      return total + rewards;
    }, 0);
  });

  return totalRewards;
};


  const totalRewardsForThreeMonths = calculateTotalRewardsForThreeMonths();

  return (
    <div>
      <h1>Reward Points Calculator</h1>
      <table class="customer-rewards">
        <thead>
          <tr>
            <th>Customer ID</th>
            {months.map((month) => (
              <th key={month}>{month}</th>
            ))}
            <th>Total Rewards for 3 Months</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(monthlyRewards).map((customerId) => (
            <tr key={customerId}>
              <td>{customerId}</td>
              {months.map((month) => (
                <td key={month}>{monthlyRewards[customerId][month] || 0}</td>
              ))}
              <td>{totalRewardsForThreeMonths[customerId]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
