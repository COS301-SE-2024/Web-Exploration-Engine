import { Injectable } from '@nestjs/common';

@Injectable()
export class ProxyService {
  private readonly proxyPool = process.env.PROXIES;
  private proxyArr: string[];
  private readonly proxyPort = process.env.PROXY_PORT;
  private readonly proxyUsername = process.env.PROXY_USERNAME;
  private readonly proxyPassword = process.env.PROXY_PASSWORD;

  constructor() {
    if (!this.proxyPool) {
      throw new Error('No PROXIES found')
    }
    if (!this.proxyUsername || !this.proxyPassword) {
      throw new Error('PROXY_USERNAME or PROXY_PASSWORD not set');
    }
    this.proxyArr = this.proxyPool.split(',');

  }

  getProxy() {
    const proxy = this.proxyArr[Math.floor(Math.random() * this.proxyArr.length)];
    return `http://${proxy}:${this.proxyPort}`;
  }
}