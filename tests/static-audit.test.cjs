const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function listFiles(directory) {
  const fullDirectory = path.join(root, directory);
  const entries = fs.readdirSync(fullDirectory, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const relativePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      return listFiles(relativePath);
    }
    return relativePath;
  });
}

function count(source, pattern) {
  return source.match(pattern)?.length ?? 0;
}

test("environment files are ignored and Supabase keys are not hardcoded in source", () => {
  const gitignore = read(".gitignore");
  const supabaseClient = read("src/services/supabaseClient.js");
  const sourceFiles = listFiles("src").filter((file) =>
    /\.(js|jsx|ts|tsx)$/.test(file),
  );
  const allSource = sourceFiles.map(read).join("\n");

  assert.match(gitignore, /^\.env$/m);
  assert.match(gitignore, /^\.env\.\*$/m);
  assert.match(supabaseClient, /EXPO_PUBLIC_SUPABASE_URL/);
  assert.match(supabaseClient, /EXPO_PUBLIC_SUPABASE_ANON_KEY/);
  assert.doesNotMatch(allSource, /service_role/i);
  assert.doesNotMatch(allSource, /https:\/\/[a-z0-9-]+\.supabase\.co/i);
});

test("dummy info.txt files from the audit were removed from src", () => {
  const textFiles = listFiles("src").filter((file) =>
    file.endsWith("info.txt"),
  );
  assert.deepEqual(textFiles, []);
});

test("navigation no longer contains placeholder implementation comments", () => {
  const navigator = read("src/navigation/AppNavigator.js");

  assert.doesNotMatch(navigator, /to be created/i);
  assert.doesNotMatch(navigator, /Por ahora/i);
});

test("touch targets include accessibility roles and labels", () => {
  for (const file of [
    "src/screens/LoginScreen.js",
    "src/screens/ContributeScreen.js",
    "src/screens/ProfileScreen.js",
  ]) {
    const source = read(file);
    const touchables = count(source, /<TouchableOpacity\b/g);

    assert.ok(touchables > 0, `${file} should contain touch targets`);
    assert.equal(count(source, /accessibilityRole=/g), touchables, `${file} role count mismatch`);
    assert.equal(count(source, /accessibilityLabel=/g), touchables + count(source, /<TextInput\b/g), `${file} label count mismatch`);
  }
});

test("auth and contribution screens use shared validation logic", () => {
  assert.match(read("src/screens/LoginScreen.js"), /validateAuthForm/);
  assert.match(read("src/screens/LoginScreen.js"), /acceptedTerms/);
  assert.match(read("src/screens/ContributeScreen.js"), /validateContribution/);
  assert.match(
    read("src/screens/ContributeScreen.js"),
    /CONTRIBUTION_CATEGORIES/,
  );
});

test("profile logout ends the Supabase session before returning to login", () => {
  const profile = read("src/screens/ProfileScreen.js");

  assert.match(profile, /supabase\.auth\.signOut\(\)/);
  assert.match(profile, /navigation\.replace\(['\"]Login['\"]\)/);
});
