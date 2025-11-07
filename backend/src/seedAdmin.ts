import mongoose from "mongoose";
import { config as dotenvConfig } from "dotenv";
import { User } from "./models/User";
import { hashPassword } from "./utils/password";
import { generateAccountNumber } from "./utils/accountNumber";

dotenvConfig();

function getUri(): string {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) throw new Error("Missing MONGODB_URI/MONGO_URI in .env");
  return uri;
}

async function seedAdmin() {
  const uri = getUri();
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  const adminExists = await User.findOne({ username: "admin" }).lean();
  if (adminExists) {
    console.log("Admin user already exists");
    await mongoose.disconnect();
    return;
  }

  const password = "Admin@12345";
  const passwordHash = await hashPassword(password);

  const adminUser = await User.create({
    firstName: "System",
    surname: "Administrator",
    idNumber: "0000000000000",
    username: "admin",
    accountNumber: generateAccountNumber(),
    passwordHash,
    role: "admin",
  });

  console.log("   Admin user created:");
  console.log("   Username:", adminUser.username);
  console.log("   Account Number:", adminUser.accountNumber);
  console.log("   Password:", password);
  console.log("   Role:", adminUser.role);

  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
}

seedAdmin().catch((err) => {
  console.error("Error seeding admin:", err);
  process.exit(1);
});
