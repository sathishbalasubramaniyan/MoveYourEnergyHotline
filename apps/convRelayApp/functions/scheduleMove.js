/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
const {upsertUser, addEvent} = require("../services/segment-service");
const setTimeout = require('timers/promises').setTimeout;
const twilio = require('twilio');
require('dotenv').config();
async function scheduleMove(functionArgs) {
  const newAddress = functionArgs.new_address;
  const movingDate = functionArgs.moving_date;
  const newEnergyPlanType = functionArgs.new_energy_plan_type;
  const phone = functionArgs.phone;

  console.log('GPT -> called scheduleMove function, New address: ', newAddress);
  console.log('GPT -> called scheduleMove function, moving date: ', movingDate);
  console.log('GPT -> called scheduleMove function, new energy plan type: ', newEnergyPlanType);
  console.log('GPT -> called scheduleMove function, phone: ', phone);

  const moveDetails =  {
    userId: phone.substring(1),
    traits: {
      new_address: newAddress,
      moving_date: movingDate,
      new_energy_plan_type: newEnergyPlanType
    },
    event: 'Move scheduled',
    properties: {
      new_address: newAddress,
      moving_date: movingDate,
      new_energy_plan_type: newEnergyPlanType,
    },
  };

  const { userId, traits, event, properties } = moveDetails;
  upsertUser({ userId, traits });
  addEvent({ userId, event, properties });

  await setTimeout(3000);

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = twilio(accountSid, authToken);

  await client.messages.create({
    to: phone,
    from: process.env.FROM_NUMBER,
    body: `Your move to ${newAddress} on ${movingDate} has been scheduled successfully. The energy plan type at your new address will be ${(newEnergyPlanType === "electricity_and_gas")?"Electricity and Gas": "Electricity Only"}`
  });

  return "Move scheduled successfully";
}

module.exports = scheduleMove;