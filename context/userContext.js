import { createContext, useState, useEffect } from "react";
import { useAccount, useNetwork, useContractRead } from "wagmi";

const UserContext = createContext();
const abi = require("../config/United");
const contractAddress = require("../config/contractAddress");

export default function User({ children }) {
  const [hearts, setHearts] = useState(true);
  const [{ data: accountData }] = useAccount({
    fetchEns: true,
  });
  const [{ data: network }] = useNetwork();

  const [{ data: time }] = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: abi,
    },
    "timeToRespond",
    {
      watch: false,
    }
  );

  return (
    <UserContext.Provider
      value={{
        network,
        accountData,
        hearts,
        setHearts,
        time,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

const UserContextConsumer = UserContext.Consumer;

export { UserContextConsumer, UserContext };
