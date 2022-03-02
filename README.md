# poh-captcha
Captcha based on Proof of Humanity

## disclaimer
This project is for learning purposes. Im not expert in any of the tech stack used here (React, NestJs, Ethersjs).
So maybe its full of errors or there are better ways for doing it. Any suggestions are welcome in PR or issues.

## description
This is a work in progress proof of concept of a captcha based on Proof of Humanity services.
We have two key modules:

### frontend
Right now its a simple react frontend with a Captcha component. The objetive is to have some default React component published, also we can have some other frameroks components ready to go.

#### TODO'S:
- Create react component a publish it
- Create script to be added in any html form (like the one recaptcha uses)
- Unit Tests

### backend
Right now its a simple Nestjs api, with a single POST endpoint that receives the signed message from frontend and validates the sign and that the user is registered in POH.

#### TODO'S:
- Validate the message nounce its not already used.
- Validate adress directly in the blockchain (right now uses the dev api).
- Unit Tests
- Create some different flavors:
    - Node lib
    - Express Middleware
    - Nestjs Vaidator
    - Other backends languajes (Python, Java, Kotlin, Golang)

### running
- frontend:
```bash
cd client
npm start
```

- backend:
```bash
cd service
npm run start
```
