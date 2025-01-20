// src/app.service.ts
import { Injectable } from '@nestjs/common';
import * as https from 'https'; // Import https

interface CacheEntry {
  data: any;
  timestamp: number;
}

@Injectable()
export class AppService {
  private origin: string;
  private cache: Map<string, CacheEntry> = new Map();

  configure(args: any) {
    this.origin = args.origin;

    if (args.clearCache) {
      this.clearCache();
      console.log('Cache cleared.');
      process.exit(0);
    }
  }

  proxyRequest(url: string, res: any) {
    // Use https.ServerResponse
    const cachedResponse = this.cache.get(url);

    if (cachedResponse) {
      console.log('Cache HIT:', url);
      res.setHeader('X-Cache', 'HIT');
      res.writeHead(200);
      res.end(JSON.stringify(cachedResponse.data));
    } else {
      console.log('Cache MISS:', url);
      https // Use https.get()
        .get(this.origin + url, (response) => {
          let data = '';
          response.on('data', (chunk) => {
            data += chunk;
          });
          response.on('end', () => {
            this.cache.set(url, {
              data: JSON.parse(data),
              timestamp: Date.now(),
            });
            res.setHeader('X-Cache', 'MISS');
            res.writeHead(response.statusCode, response.headers);
            res.end(data);
          });
        })
        .on('error', (err) => {
          console.error('Error forwarding request:', err);
          res.writeHead(500);
          res.end('Error forwarding request');
        });
    }
  }

  clearCache() {
    this.cache.clear();
  }
}
