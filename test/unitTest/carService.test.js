import { afterEach, beforeEach, describe, it } from 'mocha'
import CarService from '../../src/service/carService.js'
import path from 'path'
import {fileURLToPath} from 'url';
import { expect } from 'chai';
import sinon from 'sinon';
import valid_carCategory from './../mocks/valid-carCategory.json' assert { type: "json" };
import valid_car from './../mocks/valid-car.json' assert { type: "json" };
import valid_customer from './../mocks/valid-customer.json' assert { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const carsDatabase = path.join(__dirname, './../../database', 'cars.json')

const mocks = {
  validCarCategory: valid_carCategory,
  validCar: valid_car,
  validCustomer: valid_customer
}

describe('CarService Suite Tests', () => {
  let carService = {}
  let sandbox = {}
  before(() => {
    carService = new CarService({
      cars: carsDatabase
    })
  })
  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })
  afterEach(() => {
    sandbox.restore()
  })
  it('should retrieve a random position from an array', () => {
    const data = [0,1,2,3,4]
    const result = carService.getRandomPositionFromArray(data)

    expect(result).to.be.lte(data.length).and.be.gte(0)
  })

  it('should choose the first id from cardIds in carCategory', () => {
    const carCategory = mocks.validCarCategory
    const cardIdIndex = 0

    sandbox.stub(
      carService,
      carService.getRandomPositionFromArray.name
    ).returns(cardIdIndex)


    const result = carService.chooseRandomCar(carCategory)
    const expected = carCategory.carIds[cardIdIndex]

    expect(carService.getRandomPositionFromArray.calledOnce).to.be.ok
    expect(result).to.be.equal(expected)
  })
  it('given a carCategory it should return an available car', async() => {
    const car = mocks.validCar
    const carCategory = Object.create(mocks.validCarCategory)
    carCategory.carIds = [car.id]

    sandbox.stub(
      carService.carRepository,
      carService.carRepository.find.name
    ).resolves(car)

    sandbox.spy(
      carService,
      carService.chooseRandomCar.name
    )

    const result = await carService.getAvailableCar(carCategory)
    const expected = car
    
    expect(carService.chooseRandomCar.calledOnce).to.be.ok
    expect(carService.carRepository.find.calledWithExactly(car.id)).to.be.ok
    expect(result).to.be.deep.equal(expected)
  })
})