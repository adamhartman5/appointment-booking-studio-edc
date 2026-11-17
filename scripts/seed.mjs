import postgres from '@prisma/orm-postgres/runtime';
import { contractFromJson } from '@prisma/orm-postgres/static';
import contract from '../src/prisma/contract.json' with { type: 'json' }

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const db = postgres({
  connectionString,
  contract: contractFromJson(contract),
});

const slots = [
  {
    startTime: '2026-12-01T09:00:00-05:00',
    endTime: '2026-12-01T09:30:00-05:00'
  },
  {
    startTime: '2026-12-01T10:00:00-05:00',
    endTime: '2026-12-01T10:30:00-05:00'
  },
  {
    startTime: '2026-12-01T11:00:00-05:00',
    endTime: '2026-12-01T11:30:00-05:00'
  }
]

const services = [
  {name: 'Onbarding Call'},
  {name: "Initial Consultation"},
  {name: 'Technology Review'},
]

const customers = [
  {
    name: 'John Smith',
    email: 'foo@bar.com',
    phone: '+15558675309'
  },
  {
    name: 'Joe Johnson',
    email: 'joe@gmail.com',
    phone: '+15555551234'
  },
  {
    name: 'Robert Jones',
    email: 'bob@gmail.com',
    phone: '+15555555678'
  }
]

async function createSlot(startTime, endTime){
  const start = new Date(startTime)
  const end = new Date(endTime)

  const existing = await db.orm.public.Slot.where({ startTime: start, endTime: end }).first()
  if(existing) return existing

  const newSlot = await db.orm.public.Slot.create({
    startTime: start,
    endTime: end
  })

  return newSlot
}

async function createService(name){
  const existing = await db.orm.public.Service.where({ name }).first()
  if(existing) return existing

  const newService = await db.orm.public.Service.create({
    name
  })

  return newService
}

async function createCustomer(name, email, phone){
  const existing = await db.orm.public.Customer.where({ email }).first()
  if (existing) return existing

  const newCustomer = await db.orm.public.Customer.create({
    name,
    email,
    phone
  })

  return newCustomer
}

async function createCalendar(){
  const existing = await db.orm.public.Calendar.first()
  if (existing) return existing

  const newCalendar = await db.orm.public.Calendar.create({})

  return newCalendar
}

async function createAppointment(slotId, serviceId, customerId, calendarId){
  const existing = await db.orm.public.Appointment
    .where({ slotId, serviceId, customerId, calendarId })
    .first()
  if (existing) return existing

  const newAppointment = await db.orm.public.Appointment.create({
    slotId,
    serviceId,
    customerId,
    calendarId
  })

  return newAppointment
}

async function main(){
  await db.connect({ url: connectionString })
  const newCalendar = await createCalendar()

  for (let i = 0; i < slots.length; i++){
    const newSlot = await createSlot(slots[i].startTime, slots[i].endTime)
    const newService = await createService(services[i].name)
    const newCustomer = await createCustomer(customers[i].name, customers[i].email, customers[i].phone)

    await createAppointment(newSlot.id, newService.id, newCustomer.id, newCalendar.id)
  }

  await db.close()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})