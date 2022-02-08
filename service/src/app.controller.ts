import { Controller, Get, Post, Headers, BadRequestException } from '@nestjs/common';
import { AppService } from './app.service';
import { ethers } from 'ethers';

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

    try {
      const signerAddr = await ethers.utils.verifyMessage(sig.message, sig.signature);
      if (signerAddr.toLowerCase() == sig.address.toLowerCase()) {
        console.log('Signature OK');
      } else {
        console.log('Signature WRONG');
        throw new BadRequestException('Wrong Signature');
      }

      const response = this.appService.findAddress(signerAddr);
      await response.forEach((value) => {
        if (value.status == 200) {
          console.log('Human registered in POH');
        } else {
          console.log('Not an Human registered in POH');
          throw new BadRequestException('Not an Human registered in POH');
        }
      });
    } catch (e) {
      throw new BadRequestException('Error trying to check signature');
    }
    return sig;
  }
}
