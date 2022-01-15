import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { UserContext } from "../context/userContext";

export default function InvalidNetwork() {
  const { network } = useContext(UserContext);
  console.log(network);
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center px-8 min-h-screen mx-auto bg-neutral-200 space-y-4">
      <h1 className="text-stone-800">INVALID NETWORK ONLY WORKING ON GOERLI</h1>
    </div>
  );
}
