import cors from "cors";
import express from "express";
import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, "data");
const usersFile = path.join(dataDir, "users.json");
const submissionsFile = path.join(dataDir, "submissions.json");
const employeeIdsFile = path.join(dataDir, "employeeIds.json");
const employeesFile = path.join(dataDir, "employees.json");
const distPath = path.join(__dirname, "../dist");

const app = express();
const sessions = new Map();

app.use(cors());
app.use(express.json());

ensureDataFiles();

function ensureDataFiles() {
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }

  if (!existsSync(usersFile)) {
    writeJson(usersFile, [
      {
        id: "u-1001",
        employeeId: "6283",
        name: "Demo User",
        email: "user@example.com",
        password: "user123",
        role: "user"
      },
      {
        id: "a-1001",
        employeeId: "9999",
        name: "Backend User",
        email: "admin@example.com",
        password: "admin123",
        role: "admin"
      }
    ]);
  }

  if (!existsSync(submissionsFile)) {
    writeJson(submissionsFile, []);
  }

  if (!existsSync(employeeIdsFile)) {
    writeJson(employeeIdsFile, []);
  }

  ensureAdminEmployeeId();
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function ensureAdminEmployeeId() {
  const users = readJson(usersFile);
  const adminIndex = users.findIndex((user) => user.role === "admin");

  if (adminIndex >= 0 && !users[adminIndex].employeeId) {
    users[adminIndex] = {
      ...users[adminIndex],
      employeeId: "9999"
    };
    writeJson(usersFile, users);
  }
}

function sanitizeUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

function normalizeEmployeeId(employeeId) {
  return String(employeeId || "").trim();
}

function isAllowedEmployeeId(employeeId) {
  const allowedEmployeeIds = readJson(employeeIdsFile).map((item) => String(item).trim());
  return allowedEmployeeIds.includes(normalizeEmployeeId(employeeId));
}

function isRegisteredEmployeeId(employeeId, users) {
  return users.some((user) => normalizeEmployeeId(user.employeeId) === employeeId);
}

function getUserFromToken(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const session = sessions.get(token);

  if (!session) {
    return null;
  }

  const users = readJson(usersFile);
  return users.find((user) => user.id === session.userId) || null;
}

function requireAuth(req, res, next) {
  const user = getUserFromToken(req);

  if (!user) {
    return res.status(401).json({ message: "Please log in again." });
  }

  req.user = user;
  next();
}

function requireAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Backend access is required." });
  }

  next();
}

function normalizePayload(body) {
  return {
    employeeId: String(body.employeeId || "").trim(),
    facultyName: String(body.facultyName || "").trim(),
    designation: String(body.designation || "").trim(),
    gender: String(body.gender || "").trim(),
    category: String(body.category || "").trim(),
    dateOfBirth: String(body.dateOfBirth || "").trim(),
    highestQualification: String(body.highestQualification || "").trim(),
    highestQualificationOther: String(body.highestQualificationOther || "").trim(),
    qualificationSpecialization: String(body.qualificationSpecialization || "").trim(),
    ugStudyDetails: String(body.ugStudyDetails || "").trim(),
    pgStudyDetails: String(body.pgStudyDetails || "").trim(),
    phdStudyDetails: String(body.phdStudyDetails || "").trim(),
    phdThesisStatus: String(body.phdThesisStatus || "").trim(),
    stateOfDomicile: String(body.stateOfDomicile || "").trim(),
    stateOfDomicileOther: String(body.stateOfDomicileOther || "").trim(),
    dateOfJoining: String(body.dateOfJoining || "").trim(),
    klUniversityExperience: String(body.klUniversityExperience || "").trim(),
    industrialExperience: String(body.industrialExperience || "").trim(),
    totalExperience: String(body.totalExperience || "").trim(),
    aadharNo: String(body.aadharNo || "").trim(),
    panNo: String(body.panNo || "").trim().toUpperCase(),
    researchLevel: String(body.researchLevel || "").trim(),
    researchLevelOther: String(body.researchLevelOther || "").trim(),
    country: String(body.country || "").trim(),
    countryOther: String(body.countryOther || "").trim(),
    netSetSlet: String(body.netSetSlet || "").trim()
  };
}

function validateSubmission(payload) {
  const missing = [];

  if (!payload.employeeId) missing.push("employee ID");
  if (!payload.facultyName) missing.push("faculty name");
  if (!payload.designation) missing.push("designation");
  if (!payload.gender) missing.push("gender");
  if (!payload.category) missing.push("category");
  if (!payload.dateOfBirth) missing.push("date of birth");
  if (!payload.highestQualification) missing.push("highest qualification");
  if (payload.highestQualification === "Other" && !payload.highestQualificationOther) {
    missing.push("highest qualification other details");
  }
  if (!payload.qualificationSpecialization) missing.push("qualification specialization");
  if (!payload.ugStudyDetails) missing.push("UG study details");
  if (!payload.pgStudyDetails) missing.push("PG study details");
  if (!payload.phdStudyDetails) missing.push("Ph.D study details");
  if (!payload.phdThesisStatus) missing.push("Ph.D thesis status");
  if (!payload.stateOfDomicile) missing.push("state of domicile");
  if (payload.stateOfDomicile === "Other" && !payload.stateOfDomicileOther) {
    missing.push("state of domicile other details");
  }
  if (!payload.dateOfJoining) missing.push("date of joining");
  if (!payload.klUniversityExperience) missing.push("KL University experience");
  if (!payload.industrialExperience) missing.push("industrial experience");
  if (!payload.totalExperience) missing.push("total experience");
  if (!payload.aadharNo) missing.push("AADHAR number");
  if (!payload.panNo) missing.push("PAN number");
  if (!payload.researchLevel) missing.push("research level");
  if (payload.researchLevel === "Other" && !payload.researchLevelOther) {
    missing.push("research level other details");
  }
  if (!payload.country) missing.push("country");
  if (payload.country === "Other" && !payload.countryOther) {
    missing.push("country other details");
  }
  if (!payload.netSetSlet) missing.push("NET / SET / SLET details");

  return missing;
}

app.post("/api/register", (req, res) => {
  const employeeId = normalizeEmployeeId(req.body.employeeId);
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  const users = readJson(usersFile);
  const missing = [];

  if (!employeeId) missing.push("employee ID");
  if (!name) missing.push("name");
  if (!email) missing.push("email");
  if (!password) missing.push("password");

  if (missing.length) {
    return res.status(400).json({ message: `Please enter ${missing.join(", ")}.` });
  }

  if (!isAllowedEmployeeId(employeeId)) {
    return res.status(403).json({ message: "Employee ID was not found in the allowed list." });
  }

  if (isRegisteredEmployeeId(employeeId, users)) {
    return res.status(409).json({ message: "Employee is already registered." });
  }

  if (users.some((user) => user.email.toLowerCase() === email)) {
    return res.status(409).json({ message: "Email is already registered." });
  }

  const user = {
    id: randomUUID(),
    employeeId,
    name,
    email,
    password,
    role: "user",
    createdAt: new Date().toISOString()
  };

  users.push(user);
  writeJson(usersFile, users);

  return res.status(201).json({ message: "Registration completed.", user: sanitizeUser(user) });
});

app.post("/api/login", (req, res) => {
  const { password } = req.body;
  const employeeId = normalizeEmployeeId(req.body.employeeId);
  const users = readJson(usersFile);
  const user = users.find(
    (item) => normalizeEmployeeId(item.employeeId) === employeeId && item.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid Employee ID or password." });
  }

  const token = randomUUID();
  sessions.set(token, { userId: user.id, createdAt: new Date().toISOString() });

  return res.json({ token, user: sanitizeUser(user) });
});

app.put("/api/update-password", (req, res) => {
  const employeeId = normalizeEmployeeId(req.body.employeeId);
  const currentPassword = String(req.body.currentPassword || "");
  const newPassword = String(req.body.newPassword || "");
  const users = readJson(usersFile);
  const userIndex = users.findIndex((user) => normalizeEmployeeId(user.employeeId) === employeeId);

  if (!employeeId || !currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Please enter employee ID, current password, and new password." });
  }

  if (userIndex === -1) {
    return res.status(404).json({ message: "Employee ID is not registered." });
  }

  if (users[userIndex].password !== currentPassword) {
    return res.status(401).json({ message: "Current password is incorrect." });
  }

  users[userIndex] = {
    ...users[userIndex],
    password: newPassword,
    passwordUpdatedAt: new Date().toISOString()
  };

  writeJson(usersFile, users);
  res.json({ message: "Password updated successfully." });
});

app.get("/api/me", requireAuth, (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});

app.get("/api/submission", requireAuth, (req, res) => {
  const submissions = readJson(submissionsFile);
  const submission = submissions.find((item) => item.userId === req.user.id) || null;

  res.json({ submission });
});

app.put("/api/submission", requireAuth, (req, res) => {
  const payload = normalizePayload(req.body);
  const missing = validateSubmission(payload);

  if (missing.length) {
    return res.status(400).json({ message: `Please enter ${missing.join(", ")}.` });
  }

  const submissions = readJson(submissionsFile);
  const now = new Date().toISOString();
  const existingIndex = submissions.findIndex((item) => item.userId === req.user.id);

  const record = {
    id: existingIndex >= 0 ? submissions[existingIndex].id : randomUUID(),
    userId: req.user.id,
    ...payload,
    updatedAt: now,
    createdAt: existingIndex >= 0 ? submissions[existingIndex].createdAt : now
  };

  if (existingIndex >= 0) {
    submissions[existingIndex] = record;
  } else {
    submissions.push(record);
  }

  writeJson(submissionsFile, submissions);
  res.json({ submission: record });
});

app.get("/api/admin/submissions", requireAuth, requireAdmin, (req, res) => {
  const submissions = readJson(submissionsFile);
  res.json({ submissions });
});

app.put("/api/admin/submissions/:id", requireAuth, requireAdmin, (req, res) => {
  const payload = normalizePayload(req.body);
  const missing = validateSubmission(payload);

  if (missing.length) {
    return res.status(400).json({ message: `Please enter ${missing.join(", ")}.` });
  }

  const submissions = readJson(submissionsFile);
  const index = submissions.findIndex((item) => item.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "Record was not found." });
  }

  submissions[index] = {
    ...submissions[index],
    ...payload,
    updatedAt: new Date().toISOString()
  };

  writeJson(submissionsFile, submissions);
  res.json({ submission: submissions[index] });
});

app.delete("/api/admin/submissions/:id", requireAuth, requireAdmin, (req, res) => {
  const submissions = readJson(submissionsFile);
  const index = submissions.findIndex((item) => item.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "Record was not found." });
  }

  const [removedSubmission] = submissions.splice(index, 1);
  writeJson(submissionsFile, submissions);

  res.json({ message: "Record deleted successfully.", submission: removedSubmission });
});

app.post("/api/logout", requireAuth, (req, res) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  sessions.delete(token);
  res.json({ message: "Logged out." });
});

app.get("/api/admin/employee-ids", requireAuth, requireAdmin, (req, res) => {
  const employeeIds = readJson(employeeIdsFile);
  res.json({ employeeIds });
});

app.get("/api/admin/unregistered-employees", requireAuth, requireAdmin, (req, res) => {
  const employeeIds = readJson(employeeIdsFile)
    .map((employeeId) => normalizeEmployeeId(employeeId))
    .filter((employeeId) => employeeId);
  const employees = existsSync(employeesFile) ? readJson(employeesFile) : [];
  const users = readJson(usersFile);
  const registeredEmployeeIds = new Set(
    users
      .map((user) => normalizeEmployeeId(user.employeeId))
      .filter((employeeId) => employeeId)
  );

  const employeeLookup = new Map(
    employees
      .map((employee) => ({
        employeeId: normalizeEmployeeId(employee.employeeId),
        name: String(employee.name || "").trim(),
        role: String(employee.role || "").trim()
      }))
      .filter((employee) => employee.employeeId)
      .map((employee) => [employee.employeeId, employee])
  );

  const unregisteredEmployees = employeeIds
    .filter((employeeId) => !registeredEmployeeIds.has(employeeId))
    .map((employeeId) => {
      const details = employeeLookup.get(employeeId);
      return {
        employeeId,
        name: details?.name || "",
        role: details?.role || ""
      };
    });

  res.json({
    employeeIds,
    registeredEmployeeIds: [...registeredEmployeeIds],
    unregisteredEmployees,
    count: unregisteredEmployees.length
  });
});

app.post("/api/admin/employee-ids", requireAuth, requireAdmin, (req, res) => {
  const employeeId = normalizeEmployeeId(req.body.employeeId);
  const employeeIds = readJson(employeeIdsFile);

  if (!employeeId) {
    return res.status(400).json({ message: "Please enter an employee ID." });
  }

  if (employeeIds.includes(employeeId)) {
    return res.status(409).json({ message: "This employee ID already exists." });
  }

  employeeIds.push(employeeId);
  writeJson(employeeIdsFile, employeeIds);

  res.status(201).json({ message: "Employee ID added successfully.", employeeIds });
});

app.delete("/api/admin/employee-ids/:employeeId", requireAuth, requireAdmin, (req, res) => {
  const employeeId = normalizeEmployeeId(req.params.employeeId);
  const employeeIds = readJson(employeeIdsFile);
  const index = employeeIds.indexOf(employeeId);

  if (index === -1) {
    return res.status(404).json({ message: "Employee ID not found." });
  }

  employeeIds.splice(index, 1);
  writeJson(employeeIdsFile, employeeIds);

  res.json({ message: "Employee ID deleted successfully.", employeeIds });
});
if (existsSync(distPath)) {
  app.use(express.static(distPath));

  app.get("*", (req, res, next) => {
    // Don't intercept API routes
    if (req.path.startsWith("/api")) {
      return next();
    }

    res.sendFile(path.join(distPath, "index.html"));
  });
}
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
