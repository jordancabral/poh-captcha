import Captcha from "./Captcha";
import { useState } from "react";
import Loader from "react-loader-spinner";

// Simple dummy form that includes POH Captcha 
function App() {

  const [captcha, setCaptcha] = useState('');
  const [loading, setLoading] = useState(false);

  const wrong = () => {
    alert('wrong captcha')
  }

  const right = (sig) => {
    console.log(sig)
    setCaptcha(sig)
  }


  const error = (error) => {
    alert('Error: ' + error)
  }

  const submit = () =>  {
    setLoading(true)
    const url = process.env.API_URL || 'https://poh-captcha.herokuapp.com'
    fetch(url, {
      method: 'post',
      headers: {'poh-captcha': captcha}
    }).then(
      (result) => {
          if (result.ok){
            alert('submit ok')
          } else {
            alert('submit wrong status:' + result.status)
            console.log(result)
          }
          setLoading(false)
      },
      (error) => {
          alert('submit error')
          console.error(error)
          setLoading(false)
      }
    );
  }

  return (
    <div>
      <Loader
        className="loader"
        type="TailSpin"
        color="#ffc700"
        height={300}
        width={300}
        visible={loading}
      />
      <h1>Proof Of Humanity Captcha</h1>
      <Captcha handleWrong={wrong} handleRight={right} handleError={error}/>
      <button type="button" onClick={submit}>Submit</button>
    </div>
  );

}

export default App;
