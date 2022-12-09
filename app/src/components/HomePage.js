import { Web3Button } from "@web3modal/react";
import "./HomePage.css";
import image from './7.svg';
import {useAccount, useContractRead, useContractWrite} from 'wagmi';
import { useEffect, useState } from "react";

import { WHITELISTCONTRACT_ABI,
         WHITELISTCONTRACT_ADDRESS ,
         OWNER_ADDRESS  } from "./constants";
import {useWeb3ModalTheme} from '@web3modal/react'
import {MdVerified} from 'react-icons/md';
import ReactLoading from "react-loading";
import {BsEmojiSmileUpsideDownFill} from 'react-icons/bs'
import {AiFillTwitterCircle, AiFillGithub} from 'react-icons/ai'

const HomePage = () => {
    "use strict"
    const { setTheme} = useWeb3ModalTheme();
    setTheme({themeColor: "blackWhite"});

    const account = useAccount();
    const [deadline, setDeadline] = useState(0);
    const [deadlineReached, setDeadlineReached] = useState(false);
    const [maxAddressToWhitelist, setMaxAddressToWhitelist] = useState(0);
    const [addressWhitelisted, setAddressWhitelisted] = useState(0);
    const [isWhitelisted, setIsWhitelisted] = useState(false);
    const [whitelisted, setWhitelisted] = useState(false);
    const now = new Date();

    const {refetch: getDeadline} = useContractRead({
        address: WHITELISTCONTRACT_ADDRESS,
        abi: WHITELISTCONTRACT_ABI,
        functionName: "whitelistDeadline",
        onSuccess(data) {
            setDeadline(new Date(parseInt(data.toString()) * 1000));
            setDeadlineReached(new Date(parseInt(data.toString()) * 1000) < now.toLocaleString());
            
        }
    });

    const {refetch: getMaxAddressToWhitelist} = useContractRead({
        address: WHITELISTCONTRACT_ADDRESS,
        abi: WHITELISTCONTRACT_ABI,
        functionName: "maxAddressToWhitelist",
        onSuccess(data) {
            setMaxAddressToWhitelist(parseInt(data._hex));
            
        }
    });

    const {refetch: getAddressWhitelisted} = useContractRead({
        address: WHITELISTCONTRACT_ADDRESS,
        abi: WHITELISTCONTRACT_ABI,
        functionName: "addressWhitelisted",
        onSuccess(data) {
            setAddressWhitelisted(parseInt(data._hex));
            
        }
    })

    const {write: startWhitelist} = useContractWrite({
        address: WHITELISTCONTRACT_ADDRESS,
        abi: WHITELISTCONTRACT_ABI,
        functionName: "startWhitelist",
        args: [20],
        onSuccess() {
            console.log("successful")
        }
    })
    
    const {refetch: isAddressWhitelisted} = useContractRead({
        address: WHITELISTCONTRACT_ADDRESS,
        abi: WHITELISTCONTRACT_ABI,
        functionName: "WhitelistedAddresses",
        args: [account.address],
        onSuccess(data) {
          setIsWhitelisted(data)
            console.log(data)
        }
    })
    const {write: whitelist, isLoading: isLoadingWhitelising} = useContractWrite({
        address: WHITELISTCONTRACT_ADDRESS,
        abi: WHITELISTCONTRACT_ABI,
        functionName: "whitelist",
        onSuccess(data) {
            setWhitelisted(data)
        }
    })


    
    return (
        <div className="Home">
            <h1> 
                Welcome to Whitelist DApp
            </h1>
            <h3 className="description">
                by Whitelisting yourself, you can later 
                <br />
                purchase our exlusive NFTs with <span className="discount-span">50% discount</span> 
            </h3>
            <img src={image} />
            <div className="Home-inner">
                <span className="connect-btn">
                    <Web3Button className="web3-btn"/>
                </span>

               
                {  
                    account.address == OWNER_ADDRESS ? 
                    !deadlineReached ? 
                    <span className="whitelist-btn-span">
                    <button className="whitelist-btn" disabled={deadlineReached || addressWhitelisted >= maxAddressToWhitelist || !account.address} onClick={whitelist}> 
                      Whitelist
                    </button> 
                    </span>
                    :
                    <span className="whitelist-btn-span">
                    <button className="whitelist-btn" onClick={startWhitelist} disabled={deadline.toLocaleString > now.toLocaleString() || maxAddressToWhitelist !== 0}> 
                        Start Whitelist
                    </button> 
                    </span>  
                    : 
                    isWhitelisted ? 
                    <div className="msg-whitelisted-div">
                        <p className="msg-whitelisted-p">
                          <MdVerified className="whitelisted-address-msg" style={{backgroundColor: "greenyellow"}}/>  You have alredy been whitelisted
                        </p>
                    </div>
                    :
                    isLoadingWhitelising ? 
                    <span className="whitelist-btn-span">
                    <button className="whitelist-btn whitelist-btn-loading" disabled={deadlineReached || addressWhitelisted >= maxAddressToWhitelist || !account.address} onClick={whitelist}> 
                      <ReactLoading type="spin" height={"50%"} width={"50%"} className="loading-btn"/> 
                    </button> 
                    </span>  
                    :
                    <span className="whitelist-btn-span">
                    <button className="whitelist-btn" disabled={deadlineReached || addressWhitelisted >= maxAddressToWhitelist || !account.address} onClick={whitelist}> 
                      Whitelist
                    </button> 
                    </span>  
                }
               
                    
                
                {
                    deadlineReached || addressWhitelisted >= maxAddressToWhitelist ? 
                    <div className="msg-whitelisted-div msg-finished-whitelist">
                        <p className="msg-whitelisted-p msg-finished-p" style={{color: "white"}}>
                          <BsEmojiSmileUpsideDownFill className="whitelisted-address-msg" style={{color: "white"}}/>  Sorry! Whitelisting have finished
                        </p>
                    </div>
                    :
                    whitelisted ? 
                    <>
                    <div className="msg-whitelisted-div">
                        <p className="msg-whitelisted-p">
                          <MdVerified className="whitelisted-address-msg" style={{backgroundColor: "greenyellow"}}/>  Congrats! You are now Whitelisted
                        </p>
                    </div>
                    <ul >
                    <li>
                        Deadline: {deadline.toLocaleString()} Days remaining
                    </li>
                    <li>
                        Whitelisted Addresses: {addressWhitelisted } / {maxAddressToWhitelist}
                    </li>
                    </ul>
                      </>
                    :
                    <ul >
                        <li>
                            Deadline: {deadline.toLocaleString()} 
                        </li>
                        <li>
                            Whitelisted Addresses: {addressWhitelisted } / {maxAddressToWhitelist}
                        </li>
                    </ul>
                }
               
               
            </div>
        </div>
    )
}

export default HomePage;