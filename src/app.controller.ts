// src/app.controller.ts
import { Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('*')
  handleRequest(@Req() req: any, @Res() res: any) {
    const url = req.url;
    this.appService.proxyRequest(url, res);
  }
}
