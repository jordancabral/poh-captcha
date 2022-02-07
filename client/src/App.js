import Captcha from "./Captcha";
import { useState } from "react";

function App() {

  const [captcha, setCaptcha] = useState('');

  const wrong = () => {
    alert('wrong captcha')
  }

  const right = (sig) => {
    console.log(sig)
    setCaptcha(sig)
  }

  const submit = () =>  {
    fetch('http://localhost:3001', {
      method: 'post',
      headers: {'poh-captcha': captcha}
    }).then(
      (result) => {
          alert('submit ok')
          console.log(result)
      },
      (error) => {
          alert('submit error')
          console.error(error)
      }
    );
  }

  return (
    <div>
      <h1>Proof Of Humanity Captcha</h1>
      <Captcha handleWrong={wrong} handleRight={right}/>
      <button type="button" onClick={submit}>Submit</button>
    </div>
  );

}

export default App;
