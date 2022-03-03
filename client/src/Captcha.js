import React from "react";
import POH from "./contracts/ProofOfHumanity.json";
import { useState } from "react";
import Loader from "react-loader-spinner";
import { ethers } from "ethers";
import { v4 as uuid } from 'uuid';
import "./Captcha.css"

const Captcha = ({handleWrong, handleOk, handleError }) => {

    const [photo, setPhoto] = useState("https://app.proofofhumanity.id/images/governance.png");
    const [checked, setChecked] = useState(null);
    const [loading, setLoading] = useState(false);


    const validateAdress = async () => {

      setLoading(true)

      try {
        // Check if wallet is installed
        if (!window.ethereum)
          throw new Error("No crypto wallet found. Please install it.");
    
        // A Web3Provider wraps a standard Web3 provider, which is
        // what MetaMask injects as window.ethereum into each page
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        // MetaMask requires requesting permission to connect users accounts
        await provider.send("eth_requestAccounts", []);

        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        // Load POH contract
        const network = await provider.getNetwork()
        const networkId = network.chainId
        const pohNetwork = POH.networks[networkId];
        const pohContract = new ethers.Contract(pohNetwork.address, POH.abi, provider);

        // Check if user is registered in POH
        const response = await pohContract.isRegistered(address);
        if (!response){
          handleWrong();
        } else {
          
          // Create message
          const nonce = uuid();
          const date = new Date().toISOString()
          const message = JSON.stringify({
            nonce,
            date
          })
          
          // Sign the message
          const signature = await signer.signMessage(message);
          const sig = {
              address,
              message,
              signature 
          }
      
          // Get Info from API
          getProfileInfo(address)

          setLoading(false)
          setChecked(true);

          handleOk(Buffer.from(JSON.stringify(sig)).toString('base64'));
        }

      } catch (err) {
          handleError();
          console.error(err.message);
      }
    };

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
