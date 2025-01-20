// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as yargs from 'yargs';
import { AppService } from './app.service';
async function bootstrap() {
  const argv = yargs(process.argv.slice(2))
    .options({
      port: { type: 'number', demandOption: true, alias: 'p' },
      origin: { type: 'string', demandOption: true, alias: 'o' },
      'clear-cache': { type: 'boolean', demandOption: false, alias: 'c' },
    })
    .parseSync();

  const app = await NestFactory.create(AppModule);

  // Inject command line arguments into the application
  app.get(AppService).configure(argv);

  await app.listen(argv.port);
  console.log(
    `Caching proxy server listening on port ${argv.port}, origin: ${argv.origin}`,
  );
}
bootstrap();
