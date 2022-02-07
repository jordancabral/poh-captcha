import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {}

  findAddress(address: string): Observable<AxiosResponse<string>> {
    return this.httpService.get(`https://api.poh.dev/profiles/${address}`);
  }
}
