import { type User, type InsertUser, type ProxyRequest, type InsertProxyRequest } from "@shared/schema";
import { randomUUID } from "node:crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  logProxyRequest(request: InsertProxyRequest): Promise<ProxyRequest>;
  getProxyRequests(): Promise<ProxyRequest[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private proxyRequests: Map<string, ProxyRequest>;

  constructor() {
    this.users = new Map();
    this.proxyRequests = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async logProxyRequest(insertRequest: InsertProxyRequest): Promise<ProxyRequest> {
    const id = randomUUID();
    const request: ProxyRequest = { 
      ...insertRequest, 
      id,
      requestedAt: new Date()
    };
    this.proxyRequests.set(id, request);
    return request;
  }

  async getProxyRequests(): Promise<ProxyRequest[]> {
    return Array.from(this.proxyRequests.values());
  }
}

// Use in-memory storage for Vercel compatibility (faster cold starts)
export const storage = new MemStorage();
