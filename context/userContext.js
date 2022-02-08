import { createContext, useState } from "react";
import { useAccount, useNetwork, useContractRead } from "wagmi";
import useSWR from "swr";

const UserContext = createContext();
const abi = require("../config/ENSTogetherABI");
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
    "unionWith",
    { skip: true }
  );
  const { data: union, mutate } = useSWR({ args: accountData?.address }, readP);

  return (
    <UserContext.Provider
      value={{
        network,
        accountData,
        hearts,
        setHearts,
        time,
        union,
        mutate,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

const UserContextConsumer = UserContext.Consumer;

export { UserContextConsumer, UserContext };
