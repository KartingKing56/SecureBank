import mongoose from "mongoose";
import { config as dotenvConfig } from "dotenv";
import { User } from "../models/User";
import { Transaction } from "../models/Transaction";
import { Beneficiary } from "../models/Beneficiary";

dotenvConfig();

function getUri(): string {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) throw new Error("Missing MONGODB_URI/MONGO_URI in .env");
  return uri;
}

async function migrateUsers() {
  console.log("→ Users: backfilling roles and employee.active");

  const r1 = await User.updateMany(
    { role: { $exists: false } },
    { $set: { role: "customer" } }
  );
  console.log(`   set default role=customer: matched=${r1.matchedCount} modified=${r1.modifiedCount}`);

  const r2 = await User.updateMany(
    { role: "employee", $or: [ { "employee.active": { $exists: false } }, { employee: { $exists: false } } ] },
    { $set: { "employee.active": true } }
  );
  console.log(`   ensure employee.active: matched=${r2.matchedCount} modified=${r2.modifiedCount}`);

  const users = await User.updateMany(
    { },
    [{ $set: { username: { $toLower: "$username" } } }] as any
  );
  console.log(`   normalized usernames to lowercase: matched=${users.matchedCount} modified=${users.modifiedCount}`);
}

async function migrateTransactions() {
  console.log("→ Transactions: normalizing provider, swiftBic, amount Decimal128");

  const r1 = await Transaction.updateMany(
    { $or: [ { provider: { $exists: false } }, { provider: "" } ] },
    { $set: { provider: "SWIFT" } }
  );
  console.log(`   provider SWIFT defaulted: matched=${r1.matchedCount} modified=${r1.modifiedCount}`);

  const r2 = await Transaction.updateMany(
    { swiftBic: { $type: "string" } },
    [{ $set: { swiftBic: { $toUpper: "$swiftBic" } } }] as any
  );
  console.log(`   uppercased swiftBic: matched=${r2.matchedCount} modified=${r2.modifiedCount}`);

  const r3 = await Transaction.updateMany(
    { amount: { $type: "string" } },
    [{ $set: { amount: { $toDecimal: "$amount" } } }] as any
  );
  console.log(`   amount → Decimal128: matched=${r3.matchedCount} modified=${r3.modifiedCount}`);

  const r4 = await Transaction.updateMany(
    { currency: { $type: "string" } },
    [{ $set: { currency: { $toUpper: "$currency" } } }] as any
  );
  console.log(`   normalized currency uppercase: matched=${r4.matchedCount} modified=${r4.modifiedCount}`);
}

type IndexInfo = {
  name?: string;
  key: Record<string, 1 | -1>;
  unique?: boolean;
  sparse?: boolean;
};

function keyEquals(a: Record<string, 1 | -1>, b: Record<string, 1 | -1>) {
  const ak = Object.keys(a);
  const bk = Object.keys(b);
  if (ak.length !== bk.length) return false;
  return ak.every((k) => b[k] === a[k]);
}

async function dropLegacyUserIndexNames() {
  const legacy = ["idNumber_1", "username_1", "accountNumber_1", "employee.staffId_1", "uniq_employee_staffId_1"]; 
  for (const name of legacy) {
    try {
      await User.collection.dropIndex(name);
      console.log(`   dropped legacy index: ${name}`);
    } catch (e: any) {
      if (e?.code === 27) console.log(`   index ${name} not found (ok)`);
      else throw e;
    }
  }
}

async function dropConflictingUserIndexes() {
  const desired: Array<{ key: Record<string, 1 | -1>; name: string }> = [
    { key: { username: 1 }, name: "uniq_username" },
    { key: { idNumber: 1 }, name: "uniq_idNumber" },
    { key: { accountNumber: 1 }, name: "uniq_accountNumber" },
    { key: { role: 1 }, name: "idx_role" },
    { key: { "employee.staffId": 1 }, name: "uniq_employee_staffId_1" },
  ];

  const existing: IndexInfo[] = await (User.collection as any).indexes();

  for (const want of desired) {
    const matchesByKey = existing.filter((ix) => keyEquals(ix.key || {}, want.key));

    for (const ix of matchesByKey) {
      const ixName = ix.name ?? "";
      if (ixName !== want.name) {
        console.log(
          `   dropping conflicting index by key ${JSON.stringify(
            want.key
          )}: existing name="${ixName}", want="${want.name}"`
        );
        if (ixName) {
          await User.collection.dropIndex(ixName);
        }
      }
    }
  }
}

async function migrateBeneficiaries() {
  console.log("→ Beneficiaries: uppercasing foreign fields and syncing indexes");

  const r1 = await Beneficiary.updateMany(
    { country: { $type: "string" } },
    [{ $set: { country: { $toUpper: "$country" } } }] as any
  );
  console.log(`   uppercased country: matched=${r1.matchedCount} modified=${r1.modifiedCount}`);

  const r2 = await Beneficiary.updateMany(
    { swiftBic: { $type: "string" } },
    [{ $set: { swiftBic: { $toUpper: "$swiftBic" } } }] as any
  );
  console.log(`   uppercased swiftBic: matched=${r2.matchedCount} modified=${r2.modifiedCount}`);

  const r3 = await Beneficiary.updateMany(
    { ibanOrAccount: { $type: "string" } },
    [{ $set: { ibanOrAccount: { $toUpper: "$ibanOrAccount" } } }] as any
  );
  console.log(`   uppercased ibanOrAccount: matched=${r3.matchedCount} modified=${r3.modifiedCount}`);

  await Beneficiary.syncIndexes();
  console.log("   Beneficiary indexes synced");
}

async function syncAllIndexes() {
  console.log("→ Syncing model indexes");
  await User.syncIndexes();
  await Transaction.syncIndexes();
  await Beneficiary.syncIndexes();
  console.log("   All indexes synced");
}

async function main() {
  const uri = getUri();
  await mongoose.connect(uri);
  console.log("Connected:", uri.replace(/\/\/[^@]+@/, "//<redacted>@"));

  try {
    await migrateUsers();
    await migrateTransactions();
    await migrateBeneficiaries();
    await dropLegacyUserIndexNames();
    await dropConflictingUserIndexes();
    await syncAllIndexes();
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected");
  }
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
