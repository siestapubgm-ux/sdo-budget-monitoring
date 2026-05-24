require("dotenv").config({ path: ".env.local" });

const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(`
❌ Missing environment variables in .env.local!
Add: SUPABASE_SERVICE_ROLE_KEY=your_key
  `);
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const users = [
  { email: "budget.officer@sdo.local", password: "BudgetOfficer@2026", role: "budget_officer" },
  { email: "ssme.reviewer@sdo.local", password: "SsmeReviewer@2026", role: "ssme_reviewer" },
  { email: "functional.chief@sdo.local", password: "FunctionalChief@2026", role: "functional_chief" },
  { email: "accountant@sdo.local", password: "Accountant@2026", role: "accountant" },
  { email: "asds@sdo.local", password: "ASDS@2026", role: "asds" },
  { email: "sds@sdo.local", password: "SDS@2026", role: "sds" },
  { email: "program.owner@sdo.local", password: "ProgramOwner@2026", role: "program_owner" },
  { email: "pmt.validator@sdo.local", password: "PMTValidator@2026", role: "pmt_validator" },
  { email: "pmis.coordinator@sdo.local", password: "PMISCoordinator@2026", role: "pmis_coordinator" },
  { email: "hrd.reviewer@sdo.local", password: "HRDReviewer@2026", role: "hrd_reviewer" },
  { email: "system.admin@sdo.local", password: "SystemAdmin@2026", role: "system_admin" },
];

async function setupUsers() {
  console.log("🚀 Setting up all dashboard users...\n");

  for (const user of users) {
    try {
      console.log(`⏳ Creating: ${user.email} (${user.role})`);

      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: { role: user.role },
      });

      if (error) {
        console.error(`❌ ${error.message}\n`);
        continue;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ role: user.role })
        .eq("id", data.user.id);

      console.log(`✅ Created and updated profile\n`);
    } catch (error) {
      console.error(`❌ Error: ${error.message}\n`);
    }
  }

  console.log("✨ Complete!\n");
  console.log("📝 Credentials:");
  users.forEach((u) => console.log(`  ${u.email} / ${u.password}`));
}

setupUsers().catch(console.error);
