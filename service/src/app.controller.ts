import { Controller, Get, Post, Headers, BadRequestException } from '@nestjs/common';
import { AppService } from './app.service';
import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';

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
    console.log('Plain signature message: ' + sig.message);

    let message = new SiweMessage(sig.message);

    try {
      // Validate signature
      const fields = await message.validate(sig.signature);
      console.log('Signature OK, validated signature message fields: ' + JSON.stringify(fields));
      
      // Find address in POH
      const response = this.appService.findAddress(fields.address);
      await response.forEach((value) => {
        if (value.status == 200) {
          console.log('Human registered in POH');
        } else {
          const errorMessage = 'Not an Human registered in POH'
          console.log(errorMessage);
          throw new BadRequestException(errorMessage);
        }
      });
    } catch (e) {
      throw new BadRequestException('Error trying to check signature');
    }
    return sig;
  }
}
