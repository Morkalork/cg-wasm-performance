const getAverageAge = (data) =>
  data.reduce((acc, val) => acc + val.age, 0) / data.length;
const getMostCommonShirtSize = (data) => {
  const shirtSizes = data.map((person) => person.shirtSize);
  const counts = {};
  shirtSizes.forEach(function (x) {
    counts[x] = (counts[x] || 0) + 1;
  });
  const sortedCounts = Object.keys(counts).sort(function (a, b) {
    return counts[a] - counts[b];
  });
  return sortedCounts[sortedCounts.length - 1];
};

export const processData = (content) => {
  const data = JSON.parse(content);
  const information = {
    averageAge: getAverageAge(data),
    mostCommonShirtSize: getMostCommonShirtSize(data),
  };
  return information;
};
