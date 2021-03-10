const adjectives = require('../json/adjectives.json');
const animals = require('../json/animals.json');

export default function generateName() {
  let adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  adjective = adjective.charAt(0).toUpperCase() + adjective.slice(1);

  const animal = animals[Math.floor(Math.random() * animals.length)];
  const name = `${adjective[0].toUpperCase()}${adjective.slice(1)} ${animal}`;
  return name;
}
