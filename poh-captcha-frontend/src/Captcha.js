import React from "react";
import getWeb3 from "./getWeb3";
import POH from "./contracts/ProofOfHumanity.json";
import { useState, useEffect } from "react";
import Loader from "react-loader-spinner";
import "./Captcha.css"

const Captcha = props => {

    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState(null);
    const [contract, setContract] = useState(null);
    const [photo, setPhoto] = useState("https://app.proofofhumanity.id/images/governance.png");
    const [checked, setChecked] = useState(null);
    const [loading, setLoading] = useState(false);
  
    const loadContract = async () => {
      try {

        // Get network provider and web3 instance.
        const web3 = await getWeb3();
        setWeb3(web3);
  
        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();
        setAccounts(accounts);
  
        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = POH.networks[networkId];
        const contract = new web3.eth.Contract(
          POH.abi,
          deployedNetwork && deployedNetwork.address
        );
        setContract(contract);
  
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
    };

    const validateAdress = async () => {

        console.log('checked')
        setLoading(true)

        // Get info of user
        const response = await contract.methods.isRegistered(accounts[0]).call();
        if (!response){
            props.handleWrong();
        } else {
    
            const message = web3.utils.randomHex(32)
            // Signs the messageHash with a given account
            const signature = await web3.eth.personal.sign(message, accounts[0]);
            const sig = {
                address: accounts[0],
                message,
                signature 
            }
            console.log(sig)
        
            // Get Info from API
            getProfileInfo(accounts[0])

            setLoading(false)
            setChecked(true);

            props.handleRight(Buffer.from(JSON.stringify(sig)).toString('base64'));
    
            // // Backend validation test (this goes in backend)
            // const signer = await web3.eth.personal.ecRecover(message, signature);
            // console.log('signer ' + signer)
            // if (web3.utils.toChecksumAddress(signer) === web3.utils.toChecksumAddress(sig.address)) {
            //     console.log('Signature OK')  
            // } else {
            //     console.log('Signature WRONG')  
            // }
    
        }
    
    
      }

    const getProfileInfo = (address) => {
        fetch(`https://api.poh.dev/profiles/${address}`)
        .then(res => res.json())
        .then(
          (result) => {
              setPhoto(result.photo)
          },
          (error) => {
              console.error(error)
          }
        )
    }

    useEffect(() => {
        loadContract();
    }, []);

    if (!web3) {
        return <div>Loading Web3, accounts, and contract...</div>;
    }

    return (
        <div className="captcha-container">
            <div className="pure-material-checkbox">
                    <Loader
                        className="loader"
                        type="TailSpin"
                        color="#ffc700"
                        height={22}
                        width={22}
                        visible={loading}
                    />
                    <div className={checked ? 'checkbox checked': 'checkbox'} onClick={ () => validateAdress() } />
                    <span onClick={ () => validateAdress()}> I'm not a robot </span>
                    <div className="selfie" ><img src={photo} alt="selfie" /></div>
            </div>
        </div>
    );
}

export default Captcha;
