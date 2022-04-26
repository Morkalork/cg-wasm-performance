const fs = require("fs");

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const generateData = () => {
  const names = [
    "magnus",
    "eric",
    "shahriar",
    "blake",
    "saair",
    "sebastian",
    "susanna",
    "martin",
    "alex",
    "peter",
  ];
  const surnames = [
    "ferm",
    "wingren",
    "newaz",
    "miller",
    "svensson",
    "smith",
    "lundqvist",
    "quaderi",
    "jones",
    "dieter",
  ];
  const emailDomains = [
    "gmail.com",
    "hotmail.com",
    "yahoo.com",
    "hotmail.co.uk",
    "hotmail.fr",
    "hotmail.de",
    "hotmail.it",
    "hotmail.es",
    "hotmail.nl",
    "hotmail.se",
  ];
  const cities = [
    "stockholm",
    "göteborg",
    "malmö",
    "kristianstad",
    "karlskrona",
    "karlstad",
    "karlskoga",
    "karlshamn",
    "karlshög",
    "lund",
    "ystad",
  ];
  const shirtSizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const size = 1000000;
  const people = [];
  for (let i = 0; i < size; i++) {
    const name = names[Math.floor(Math.random() * names.length)];
    const surname = surnames[Math.floor(Math.random() * surnames.length)];
    const email =
      name +
      "." +
      surname +
      "@" +
      emailDomains[Math.floor(Math.random() * emailDomains.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const shirtSize = shirtSizes[Math.floor(Math.random() * shirtSizes.length)];
    const person = {
      id: i,
      name,
      surname,
      age: randomIntFromInterval(18, 60),
      email,
      city,
      shirtSize,
    };
    people.push(person);
  }

  fs.writeFile("large_data.json", JSON.stringify(people), (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
  });
};

generateData();
