async function verifyDOB(functionArgs) {
  const dob_from_customer = functionArgs.dob_from_customer;
  const dob_customer_profile = functionArgs.dob_customer_profile;

  console.log('GPT -> called verifyDOB function, DOB provided by customer: ', dob_from_customer);
  console.log('GPT -> called verifyDOB function, DOB from customer profile: ', dob_customer_profile);
  
  if (dob_from_customer === dob_customer_profile) {
    return 'Date of birth verification successful';
  } else {
    return 'Date of birth verification failed';
  }
}
  
module.exports = verifyDOB;