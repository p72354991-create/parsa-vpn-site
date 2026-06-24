import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import crypto from "crypto";

const DB_PATH = join(process.cwd(), "src", "data", "db.json");

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  avatar: string;
  provider: "local" | "google";
  resetToken: string;
  resetExpiry: number;
  createdAt: string;
}

export interface Message {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  category: string;
  subject: string;
  messages: { sender: "user" | "admin"; text: string; time: string }[];
  status: "open" | "closed";
  createdAt: string;
}

export interface Purchase {
  id: string;
  userId: string;
  userName: string;
  planType: "volume" | "unlimited";
  gigabytes: number;
  totalPrice: string;
  receipt: string;
  status: "pending" | "approved" | "rejected";
  rejectReason: string;
  subscriptionLink: string;
  createdAt: string;
  approvedAt: string;
}

export interface Admin {
  id: string;
  username: string;
  password: string;
  name: string;
  role: "owner" | "support" | "purchases" | "editor";
  createdAt: string;
}

export interface DB {
  users: User[];
  messages: Message[];
  purchases: Purchase[];
  admins: Admin[];
}

function readDB(): DB {
  if (!existsSync(DB_PATH)) {
    const empty: DB = { users: [], messages: [], purchases: [], admins: [] };
    writeFileSync(DB_PATH, JSON.stringify(empty, null, 2), "utf-8");
    return empty;
  }
  const data = JSON.parse(readFileSync(DB_PATH, "utf-8"));
  if (!data.purchases) data.purchases = [];
  return data;
}

function writeDB(data: DB) {
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export function generateId(): string {
  return crypto.randomBytes(16).toString("hex");
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// Users
export function findUserByEmail(email: string): User | undefined {
  return readDB().users.find((u) => u.email === email);
}

export function findUserByPhone(phone: string): User | undefined {
  return readDB().users.find((u) => u.phone === phone);
}

export function findUserById(id: string): User | undefined {
  return readDB().users.find((u) => u.id === id);
}

export function findUserByResetToken(token: string): User | undefined {
  return readDB().users.find(
    (u) => u.resetToken === token && u.resetExpiry > Date.now()
  );
}

export function createUser(data: Omit<User, "id" | "resetToken" | "resetExpiry" | "createdAt">): User {
  const db = readDB();
  const user: User = {
    ...data,
    id: generateId(),
    resetToken: "",
    resetExpiry: 0,
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  writeDB(db);
  return user;
}

export function updateUser(id: string, data: Partial<User>): void {
  const db = readDB();
  const idx = db.users.findIndex((u) => u.id === id);
  if (idx !== -1) {
    db.users[idx] = { ...db.users[idx], ...data };
    writeDB(db);
  }
}

export function getAllUsers(): User[] {
  return readDB().users;
}

// Messages
export function createMessage(data: Omit<Message, "id" | "messages" | "status" | "createdAt">): Message {
  const db = readDB();
  const msg: Message = {
    ...data,
    id: generateId(),
    messages: [],
    status: "open",
    createdAt: new Date().toISOString(),
  };
  db.messages.push(msg);
  writeDB(db);
  return msg;
}

export function getMessagesByUser(userId: string): Message[] {
  return readDB().messages.filter((m) => m.userId === userId);
}

export function getMessageById(id: string): Message | undefined {
  return readDB().messages.find((m) => m.id === id);
}

export function getAllMessages(): Message[] {
  return readDB().messages;
}

export function addMessageToThread(messageId: string, sender: "user" | "admin", text: string): void {
  const db = readDB();
  const idx = db.messages.findIndex((m) => m.id === messageId);
  if (idx !== -1) {
    db.messages[idx].messages.push({
      sender,
      text,
      time: new Date().toISOString(),
    });
    writeDB(db);
  }
}

export function closeMessage(messageId: string): void {
  const db = readDB();
  const idx = db.messages.findIndex((m) => m.id === messageId);
  if (idx !== -1) {
    db.messages[idx].status = "closed";
    writeDB(db);
  }
}

// Purchases
export function createPurchase(data: Omit<Purchase, "id" | "status" | "rejectReason" | "subscriptionLink" | "createdAt" | "approvedAt">): Purchase {
  const db = readDB();
  const purchase: Purchase = {
    ...data,
    id: generateId(),
    status: "pending",
    rejectReason: "",
    subscriptionLink: "",
    createdAt: new Date().toISOString(),
    approvedAt: "",
  };
  db.purchases.push(purchase);
  writeDB(db);
  return purchase;
}

export function getPurchasesByUser(userId: string): Purchase[] {
  return readDB().purchases.filter((p) => p.userId === userId);
}

export function getAllPurchases(): Purchase[] {
  return readDB().purchases;
}

export function approvePurchase(id: string, subscriptionLink: string): void {
  const db = readDB();
  const idx = db.purchases.findIndex((p) => p.id === id);
  if (idx !== -1) {
    db.purchases[idx].status = "approved";
    db.purchases[idx].subscriptionLink = subscriptionLink;
    db.purchases[idx].approvedAt = new Date().toISOString();
    writeDB(db);
  }
}

export function rejectPurchase(id: string, reason: string): void {
  const db = readDB();
  const idx = db.purchases.findIndex((p) => p.id === id);
  if (idx !== -1) {
    db.purchases[idx].status = "rejected";
    db.purchases[idx].rejectReason = reason;
    writeDB(db);
  }
}

// Admins
export function getAllAdmins(): Admin[] {
  return readDB().admins || [];
}

export function findAdminByUsername(username: string): Admin | undefined {
  return readDB().admins.find((a) => a.username === username);
}

export function createAdmin(data: Omit<Admin, "id" | "createdAt">): Admin {
  const db = readDB();
  if (!db.admins) db.admins = [];
  const admin: Admin = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  db.admins.push(admin);
  writeDB(db);
  return admin;
}

export function updateAdmin(id: string, data: Partial<Admin>): void {
  const db = readDB();
  const idx = db.admins.findIndex((a) => a.id === id);
  if (idx !== -1) {
    db.admins[idx] = { ...db.admins[idx], ...data };
    writeDB(db);
  }
}

export function deleteAdmin(id: string): void {
  const db = readDB();
  db.admins = db.admins.filter((a) => a.id !== id);
  writeDB(db);
}

export function ensureOwnerAdmin(): void {
  const db = readDB();
  if (!db.admins) db.admins = [];
  const ownerExists = db.admins.some((a) => a.role === "owner");
  if (!ownerExists) {
    db.admins.push({
      id: "owner",
      username: "admin",
      password: hashPassword("parsa2026"),
      name: "مالک سایت",
      role: "owner",
      createdAt: new Date().toISOString(),
    });
    writeDB(db);
  }
}
