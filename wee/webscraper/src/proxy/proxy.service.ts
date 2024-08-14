import { Injectable } from '@nestjs/common';

@Injectable()
export class ProxyService {
  private readonly proxyPool = process.env.PROXIES.split(',');
  private readonly proxyPort = 3128;
  private readonly proxyUsername = process.env.PROXY_USERNAME;
  private readonly proxyPassword = process.env.PROXY_PASSWORD;

  constructor() {
    if (!this.proxyUsername || !this.proxyPassword) {
      throw new Error('PROXY_USERNAME or PROXY_PASSWORD not set');
    }
  }

  getProxy() {
    const proxy = this.proxyPool[Math.floor(Math.random() * this.proxyPool.length)];
    return `http://${proxy}:${this.proxyPort}`;
  }
}