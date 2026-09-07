import moment from "moment";
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const getInitials = (name) => {
  if (!name) return "";

  const words = name.trim().split(" ");
  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0];
  }

  return initials.toUpperCase();
};

export const addThousandsSeparator = (num) => {
  if (num == null || isNaN(num)) return "";

  const [integerPart, fractionalPart] = num.toString().split(".");

  // Indian format: last 3 digits, then groups of 2
  const lastThree = integerPart.slice(-3);
  const remaining = integerPart.slice(0, -3);

  const formattedInteger = remaining
    ? remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree
    : lastThree;

  return fractionalPart
    ? `${formattedInteger}.${fractionalPart}`
    : formattedInteger;
};

export const prepareExpenseBarChartData = (data = []) => {
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // Group by date and sum amounts
  const grouped = {};
  sortedData.forEach((item) => {
    const dateKey = moment(item.date).format("Do MMM");
    if (grouped[dateKey]) {
      grouped[dateKey].amount += Number(item.amount);
      grouped[dateKey].source += `, ${item.category}`; // combine categories
    } else {
      grouped[dateKey] = {
        source: dateKey,
        amount: Number(item.amount),
        category: item.category,
      };
    }
  });

  return Object.values(grouped);
};

export const prepareIncomeBarChartData = (data = []) => {
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // Group by date and sum amounts
  const grouped = {};
  sortedData.forEach((item) => {
    const dateKey = moment(item.date).format("Do MMM");
    if (grouped[dateKey]) {
      grouped[dateKey].amount += Number(item.amount);
      grouped[dateKey].source += `, ${item.source}`; // combine sources
    } else {
      grouped[dateKey] = {
        category: dateKey,
        amount: Number(item.amount),
        source: item.source,
      };
    }
  });

  return Object.values(grouped);
};

export const prepareExpenseLineChartData = (data = []) => {
  const sortedData=[...data].sort((a,b)=> new Date(a.date)-new Date(b.date))
  const chartData =sortedData.map((item)=>(
    {
      month:moment(item?.date).format('Do MMM'),
      amount:item?.amount,
      category:item?.category
    }
  ))
  return chartData
}