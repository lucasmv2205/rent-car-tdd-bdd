import faker from 'faker'
import Car from '../src/entities/car.js'
import CarCategory from '../src/entities/carCategory.js'
import Customer from '../src/entities/customer.js'
import { writeFile } from 'fs/promises'
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seederBaseFolder = path.join(__dirname, "../", 'database')

const ITEMS_AMOUNT = 2

const carCategory = new CarCategory({
  id: faker.random.uuid(),
  name: faker.vehicle.type(),
  carIds: [],
  price: faker.finance.amount(20,100)
})

const cars = []
const customers = []
for(let index = 0; index<= ITEMS_AMOUNT; index++){
  const car = new Car({
    id: faker.random.uuid(),
    name: faker.vehicle.model(),
    available: true,
    gasAvailable: true,
    releaseYear: faker.date.past().getFullYear()
  })
  carCategory.carIds.push(car.id)
  cars.push(car)

  const customer = new Customer({
    id: faker.random.uuid(),
    name: faker.name.findName(),
    age: faker.random.number({min: 18, max: 50})
  })

  customers.push(customer)

}

const write = (filename, data) => writeFile(path.join(seederBaseFolder, filename), JSON.stringify(data))
;(async () => {
  await write('cars.json', cars)
  await write('carCategories.json', [carCategory])
  await write('customers.json', customers)

  console.log('cars', cars);
  console.log('carCategories', [carCategory]);
  console.log('customers', customers);
})()
