import { useState, useEffect } from "react";

import { ethers } from "ethers";
import { fromUnixTime, format, addSeconds } from "date-fns";
import Timer from "./Timer";
import { toast } from "react-toastify";

import { useEnsLookup } from "wagmi";

const abi = require("../config/United");
const contractAddress = require("../config/contractAddress");
const notifyError = (msg) => toast.error(msg);
const notifySuccess = (msg) => toast.success(msg);

export default function PendingProposal({ to, setCanPropose, time, read }) {
  const [proposal, setProposal] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().getTime());
  const dateCreated = proposal
    ? fromUnixTime(proposal?.createdAt).getTime()
    : 0;

  const formattedDate = format(dateCreated, "MMM do yyyy");
  let deadline = addSeconds(dateCreated, time).getTime();

  const [{ data: ensTo }] = useEnsLookup({
    address: to,
  });

  const cancelProposal = async () => {
    setProcessing(true);
    const { ethereum } = window;

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const response = await contract.cancelOrResetProposal().then(() =>
        contract.on("ProposalCancelled", () => {
          setProcessing(false);
          notifySuccess(`Success, you proposal was cancelled.`);
          setCanPropose(true);
        })
      );
    } catch (err) {
      handleMMerror(err);
    }
  };

  const handleMMerror = async (err) => {
    setProcessing(false);
    const code = await err.code;
    switch (code) {
      case 4001:
        notifyError("Transaction rejected by user");
        break;
      default:
        notifyError("Transaction rejected by user");
        break;
    }
  };
  const check = async () => {
    const res = await read();
    setProposal(res?.data);
  };

  useEffect(() => {
    check();
    setInterval(() => {
      const now = new Date().getTime();
      setCurrentTime(now);
    }, 1000);
    return () => clearInterval();
  }, []);

  if (!proposal) {
    return (
      <div className="flex flex-1 justify-center items-center min-h-screen">
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
    <div className="flex flex-col flex-1 justify-center items-center min-h-screen">
      {deadline <= currentTime ? (
        <div className="flex flex-col justify-center p-4 bg-red-700 text-stone-100 rounded-3xl max-w-md">
          <p className="text-md">
            You&apos;ve been brave and that&apos;s something cool. You can
            propose to somebody else when you are ready
          </p>
        </div>
      ) : (
        <Timer deadline={deadline} />
      )}
      <div className="flex flex-col  bg-gray-300 rounded-2xl p-12 min-w-[300px]  ">
        <h3>
          You&apos;ve proposed to
          <span className="font-bold mx-2"> {ensTo && ensTo}</span>
          to be registred as a couple on the Ethereum blockchain
        </h3>
        <h4>Date: {formattedDate}</h4>

        <h4>Status: {deadline < currentTime ? "Expired" : "Pending"}</h4>

        {deadline > currentTime ? (
          <button
            className="py-2 px-4 bg-stone-400 text-stone-800 rounded-full flex items-center justify-center disabled:opacity-60"
            onClick={cancelProposal}
            disabled={processing}
          >
            {processing && (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
            )}
            {processing ? "Processing..." : "Cancel"}
          </button>
        ) : (
          <button
            className="py-2 px-4 bg-stone-400 text-stone-800 rounded-full flex items-center justify-center disabled:opacity-60"
            onClick={() => setCanPropose(true)}
          >
            Propose
          </button>
        )}
      </div>
    </div>
  );
}
