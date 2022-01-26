import { createContext, useState } from "react";
import { useAccount, useNetwork, useContractRead } from "wagmi";
import useSWR from "swr";

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

  const [_, readP] = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: abi,
    },
    "proposals",
    { skip: true }
  );
  const { data: proposalsMade, mutate } = useSWR(
    { args: accountData?.address },
    readP
  );

  return (
    <UserContext.Provider
      value={{
        network,
        accountData,
        hearts,
        setHearts,
        time,
        proposalsMade,
        mutate,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

const UserContextConsumer = UserContext.Consumer;

export { UserContextConsumer, UserContext };
