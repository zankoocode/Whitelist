import { Web3Button } from "@web3modal/react";
import "./HomePage.css";
import image from './welcome.jpg';
import {useAccount, useContractRead, useContractWrite} from 'wagmi';
import { useEffect, useState } from "react";

import { WHITELISTCONTRACT_ABI,
         WHITELISTCONTRACT_ADDRESS ,
         OWNER_ADDRESS  } from "./constants";

const HomePage = () => {
    "use strict"

    const account = useAccount();
    const [deadline, setDeadline] = useState(0);
    const [deadlineReached, setDeadlineReached] = useState(false);
    const [maxAddressToWhitelist, setMaxAddressToWhitelist] = useState(0);
    const [addressWhitelisted, setAddressWhitelisted] = useState(0);
    const [isWhitelisted, setIsWhitelisted] = useState(true);
    const [whitelisted, setWhitelisted] = useState(null);
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
           // setIsWhitelisted(data)
            
        }
    })
    const {write: whitelist} = useContractWrite({
        address: WHITELISTCONTRACT_ADDRESS,
        abi: WHITELISTCONTRACT_ABI,
        functionName: "whitelist",
        onSuccess(data) {
            setWhitelisted(data)
        }
    })
    
    return (
        <div className="Home">
            <img src={image} />
            <div className="Home-inner">
                <span className="connect-btn">
                    <Web3Button />
                </span>

               
                {
                    
                    account.address == OWNER_ADDRESS ? 
                        
                    <span className="whitelist-btn-span">
                    <button className="whitelist-btn" onClick={startWhitelist} disabled={deadline.toLocaleString > now.toLocaleString() || maxAddressToWhitelist !== 0}> 
                        Start Whitelist
                    </button> 
                    </span>  

                
                    : 
                    isWhitelisted ?  
                    <div className="whitelisted">
                        you have already been whitelisted
                    </div>
                        :
                    <span className="whitelist-btn-span">
                    <button className="whitelist-btn" disabled={deadlineReached || addressWhitelisted >= maxAddressToWhitelist } onClick={whitelist}> 
                        Whitelist
                    </button> 
                    </span> 
                }
               
                    
                
                {
                    deadlineReached || addressWhitelisted >= maxAddressToWhitelist ? 
                    <h3>
                        Whitelisting Finished!
                    </h3>
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