import pg from "pg";

const regions = [
  "ap-south-1",
  "ap-southeast-1",
  "us-east-1",
  "us-east-2",
  "us-west-1",
  "us-west-2",
  "eu-central-1",
  "eu-west-1",
  "eu-west-2",
  "eu-west-3",
  "ap-northeast-1",
  "ap-southeast-2",
  "ca-central-1",
  "sa-east-1"
];

async function check() {
  for (const r of regions) {
    const host = `aws-0-${r}.pooler.supabase.com`;
    const connectionString = `postgresql://postgres.tqvafxpwqsnzwrlevjcb:learningtrackai123@${host}:6543/postgres`;
    const client = new pg.Client({
      connectionString,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 3500
    });
    try {
      await client.connect();
      console.log(">>> SUCCESS! Matched Region:", r);
      console.log(">>> Pooler Host:", host);
      await client.end();
      process.exit(0);
    } catch (e) {
      console.log(`Region ${r}: ${e.message}`);
    }
  }
}

check();

