import Head from "next/head";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/userContext";
import { useContractRead, useNetwork } from "wagmi";

//Components
import MakeProposal from "../components/MakeProposal";
import ProposalToRespond from "../components/RespondToProposal";
import PendingProposal from "../components/PendingProposal";
import UnionModal from "../components/UnionModal";

//notification
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { fromUnixTime, addSeconds } from "date-fns";
const abi = require("../config/United");
const contractAddress = require("../config/contractAddress");

export default function Propose() {
  const { time, accountData } = useContext(UserContext);
  const [querying, setQuerying] = useState(true);
  const [pExpired, setPExpired] = useState(null);
  const [canPropose, setCanPropose] = useState(false);
  const now = new Date().getTime();

  const [{ data: proposalsMade }, read] = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: abi,
    },
    "proposals",
    {
      args: accountData?.address,
    },
    {
      watch: true,
    }
  );
  const [{ data: union }, readUnion] = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: abi,
    },
    "unionWith",
    {
      args: accountData?.address,
    },
    {
      watch: true,
    }
  );
  const [{ data: networkData }] = useNetwork();

  const notifyError = (msg) => toast.error(msg);
  const notifySuccess = (msg) => toast.success(msg);

  useEffect(() => {
    const checkProposalsMade = async () => {
      console.log("checking for proposals");

      const createdAt = proposalsMade?.createdAt;
      const dateCreated = fromUnixTime(createdAt).getTime();
      const deadline = addSeconds(dateCreated, time).getTime();

      if (now > deadline || proposalsMade.exists == false) {
        setPExpired(true);
        setQuerying(false);
        setCanPropose(true);
        return;
      } else setPExpired(false);
      setQuerying(false);
      setCanPropose(false);
      return;
    };

    if (proposalsMade) {
      checkProposalsMade();
      return;
    }
    return;
  }, [proposalsMade, union]);

  const contextClass = {
    success: "bg-emerald-100 text-emerald-600 flex",
    error: "bg-rose-100 text-rose-600 flex",
  };

  if (querying || networkData?.chain.id !== 5) {
    return (
      <div className="flex flex-1 justify-center items-center min-h-screen">
        <Head>
          <title>ENSTogether</title>
        </Head>

        <svg
          className="animate-spin -ml-1 mr-3 h-24 w-24 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>ENSTogether</title>
      </Head>

      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        toastClassName={({ type }) =>
          contextClass[type || "default"] +
          " relative flex p-4 min-h-10 rounded-lg justify-between  overflow-hidden cursor-pointer"
        }
        bodyClassName={({ type }) =>
          "flex text-md font-bold p-6" + contextClass[type || "default"]
        }
      />
      {querying && <h1>Loading...</h1>}
      <div>
        {proposalsMade?.from == accountData?.address &&
          !querying &&
          !canPropose &&
          !union?.exists && (
            <PendingProposal
              proposalsMade={proposalsMade}
              to={proposalsMade.to}
              setCanPropose={setCanPropose}
              currentAccount={accountData?.address}
              time={time}
              read={read}
            />
          )}
        {proposalsMade?.to == accountData?.address &&
          !pExpired &&
          !querying &&
          !union?.exists && (
            <ProposalToRespond
              proposalsMade={proposalsMade}
              currentAccount={accountData?.address}
              time={time}
              from={proposalsMade.from}
              readUnion={readUnion}
              read={read}
            />
          )}
        {union?.exists == true && !querying && (
          <UnionModal
            un={union}
            currentAccount={accountData?.address}
            readUnion={readUnion}
          />
        )}
        {proposalsMade && !querying && canPropose && !union?.exists && (
          <MakeProposal
            notifyError={notifyError}
            notifySuccess={notifySuccess}
            currentAccount={accountData?.address}
            setCanPropose={setCanPropose}
            read={read}
          />
        )}
      </div>
    </div>
  );
}
