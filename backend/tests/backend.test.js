const assert = require("assert");
const fs = require("fs");
const path = require("path");

const backendDir = path.join(__dirname, "..");

// Basic sanity checks for the backend structure and files

try {
  // Test 1: package.json exists and has required dependencies
  const packageJsonPath = path.join(backendDir, "package.json");
  assert.ok(fs.existsSync(packageJsonPath), "package.json must exist");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  assert.ok(
    packageJson.dependencies["express"],
    "express must be in dependencies",
  );
  assert.ok(
    packageJson.dependencies["@anthropic-ai/sdk"],
    "@anthropic-ai/sdk must be in dependencies",
  );
  assert.ok(
    packageJson.dependencies["@supabase/supabase-js"],
    "@supabase/supabase-js must be in dependencies",
  );
  assert.ok(packageJson.dependencies["cors"], "cors must be in dependencies");
  assert.ok(
    packageJson.dependencies["dotenv"],
    "dotenv must be in dependencies",
  );
  assert.ok(
    packageJson.dependencies["express-rate-limit"],
    "express-rate-limit must be in dependencies",
  );

  // Test 2: .env.example exists and contains required variables
  const envExamplePath = path.join(backendDir, ".env.example");
  assert.ok(fs.existsSync(envExamplePath), ".env.example must exist");
  const envExampleContent = fs.readFileSync(envExamplePath, "utf8");
  assert.ok(
    envExampleContent.includes("ANTHROPIC_API_KEY"),
    "ANTHROPIC_API_KEY must be documented",
  );
  assert.ok(
    envExampleContent.includes("SUPABASE_URL"),
    "SUPABASE_URL must be documented",
  );
  assert.ok(
    envExampleContent.includes("SUPABASE_ANON_KEY"),
    "SUPABASE_ANON_KEY must be documented",
  );

  // Test 3: Required files exist
  assert.ok(
    fs.existsSync(path.join(backendDir, "server.js")),
    "server.js must exist",
  );
  assert.ok(
    fs.existsSync(path.join(backendDir, "routes", "ai.js")),
    "routes/ai.js must exist",
  );
  assert.ok(
    fs.existsSync(path.join(backendDir, "middleware", "auth.js")),
    "middleware/auth.js must exist",
  );

  // Test 4: Check for spanish comments and lack of hardcoded api keys in code
  const aiRouteContent = fs.readFileSync(
    path.join(backendDir, "routes", "ai.js"),
    "utf8",
  );
  const authMiddlewareContent = fs.readFileSync(
    path.join(backendDir, "middleware", "auth.js"),
    "utf8",
  );

  // Spanish comments check (heuristic)
  assert.ok(
    aiRouteContent.includes("Inicializar el cliente"),
    "Should contain spanish comments",
  );
  assert.ok(
    authMiddlewareContent.includes("Middleware para validar"),
    "Should contain spanish comments",
  );

  // API key leak check
  assert.ok(
    !aiRouteContent.includes("sk-ant"),
    "Should not contain hardcoded Anthropic keys",
  );

  console.log("All basic backend structure tests passed!");
  process.exit(0);
} catch (error) {
  console.error("Backend test failed:", error.message);
  process.exit(1);
}
