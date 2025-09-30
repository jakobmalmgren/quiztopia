import bcrypt from "bcrypt";

const saltRounds = 10;

// när man loggar in o hasha så de läggs i DB

export const hashPassword = async (password) => {
  return bcrypt.hash(password, saltRounds);
};

// compare de man skriver in sen när man loggar in och
// jämför me de hashade i DB
export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};
