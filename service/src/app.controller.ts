import { Controller, Get, Post, Headers, BadRequestException } from '@nestjs/common';
import { AppService } from './app.service';
import { recoverPersonalSignature } from 'eth-sig-util';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  getProfileInfo = (address) => {
    fetch(`https://api.poh.dev/profiles/${address}`)
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result);
        },
        (error) => {
          console.error(error);
        },
      );
  };

  @Get()
  async getInfo() {
    return "Up and running";
  }

  @Post()
  async postForm(@Headers('poh-captcha') captcha: string): Promise<string> {
    const decodedCaptcha = Buffer.from(captcha, 'base64').toString('utf8');
    const sig = JSON.parse(decodedCaptcha);



    const msgParams = {
      data: sig.message,
      sig: sig.signature,
    };
    const signer = recoverPersonalSignature(msgParams);
    // console.log(sig.address);
    // console.log(signer);

    if (signer.toLowerCase() == sig.address.toLowerCase()) {
      console.log('Signature OK');
    } else {
      console.log('Signature WRONG');
    }

    try {
      const response = this.appService.findAddress(signer);
      await response.forEach((value) => {
        if (value.status == 200) {
          console.log('Human registered in POH');
        } else {
          console.log('Not an Human registered in POH');
        }
      });
    } catch (e) {
      //console.log(e);
      throw new BadRequestException('Wrong POH captcha');
    }
    return sig;
  }
}
