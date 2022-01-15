import { createContext, useState, useEffect } from "react";
import { useAccount, useNetwork, useContractRead } from "wagmi";
import { useRouter } from "next/router";

const UserContext = createContext();
const abi = require("../config/United");
const contractAddress = require("../config/contractAddress");

export default function User({ children }) {
  const router = useRouter();
  const [{ data: accountData }] = useAccount({
    fetchEns: true,
  });
  const [{ data: network }] = useNetwork();

  // const [{ data: proposalsMade }] = useContractRead(
  //   {
  //     addressOrName: contractAddress,
  //     contractInterface: abi,
  //   },
  //   "proposals",
  //   {
  //     args: accountData?.address,
  //   },
  //   {
  //     watch: true,
  //   }
  // );

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
        // proposalsMade,
        time,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

const UserContextConsumer = UserContext.Consumer;

export { UserContextConsumer, UserContext };
