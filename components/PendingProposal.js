import { useState, useEffect } from "react";
import { fromUnixTime, format, addSeconds } from "date-fns";
import Timer from "./Timer";
import { toast } from "react-toastify";
import { FaTwitter, FaEnvelope } from "react-icons/fa";
import {
  useEnsLookup,
  useContractWrite,
  useContract,
  useProvider,
  useSigner,
} from "wagmi";

const abi = require("../config/ENSTogetherABI");
const contractAddress = require("../config/contractAddress");

export default function PendingProposal({
  to,
  setCanPropose,
  time,
  proposalsMade,
  mutate,
  currentAccount,
}) {
  let proposal = proposalsMade;
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
  const provider = useProvider();

  const contract = useContract({
    addressOrName: contractAddress,
    contractInterface: abi,
    signerOrProvider: provider,
  });

  const [cancelProp, write] = useContractWrite(
    {
      addressOrName: contractAddress,
      contractInterface: abi,
    },
    "cancelOrResetProposal"
  );

  const [_, getSigner] = useSigner({
    skip: true,
  });

  const cancelProposal = async () => {
    setProcessing(true);
    try {
      const signer = await getSigner();
      let message = "Cancel Proposal";
      await signer.signMessage(message);
    } catch (err) {
      handleMMerror(err);
      return;
    }
    const response = await write().then(
      contract.on("ProposalCancelled", (toAddress, fromAddress) => {
        if (fromAddress == currentAccount) {
          toast.success(`Proposal Cancelled`, {
            toastId: "cancelled",
          });
        }
      })
    );
    const tx = await response?.data?.wait();
    console.log(response);
    console.log("tx", tx);
    if (tx?.confirmations >= 1) {
      setCanPropose(true);
      toast.success(`transaction confirmed`, {
        toastId: "transConfirmed",
      });
      setProcessing(false);
      mutate();
      return;
    }
  };

  const handleMMerror = async (err) => {
    setProcessing(false);
    const code = await err.code;
    switch (code) {
      case 4001:
        toast.error("Transaction rejected by user");
        break;
      default:
        toast.error("Transaction rejected by user");
        break;
    }
  };

  useEffect(() => {
    setInterval(() => {
      const now = new Date().getTime();
      setCurrentTime(now);
    }, 1000);

    return () => clearInterval();
  }, []);

  if (!proposal && !ensTo) {
    return (
      <div className="flex md:flex-1 justify-center items-center min-h-screen">
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
    <>
      <div className="flex flex-col md:flex-1 justify-center items-center min-h-screen p-4">
        {deadline && deadline <= currentTime ? (
          <div className="my-8 flex flex-col justify-center p-6 bg-rose-600 text-white rounded-3xl max-w-md">
            <p className="text-md text-center">
              You&apos;ve been brave and that&apos;s something cool. <br /> You
              can propose to somebody else when you are ready
            </p>
          </div>
        ) : (
          <Timer deadline={deadline} active={true} />
        )}
        <div className="shadow shadow-rose-300/50 flex flex-col justify-center items-center text-center mt-12 bg-rose-100 rounded-2xl p-12 max-w-lg text-lg font-semibold text-rose-600 ">
          <h3>
            You&apos;ve proposed to
            <span className="font-bold mx-[4px]">{ensTo && ensTo}</span>!
          </h3>
          <h4>Date: {formattedDate}</h4>

          <h4>Status: {deadline < currentTime ? "Expired" : "Pending"}</h4>

          {deadline > currentTime ? (
            <button
              className="rounded-full font-bold text-xl bg-rose-400 text-white py-2 px-8 mt-4 flex items-center justify-center disabled:opacity-60 hover:bg-rose-500"
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
              className=" rounded-full font-bold text-xl bg-rose-400 px-8 text-white py-2 mt-4 flex items-center justify-center disabled:opacity-60 hover:bg-rose-500"
              onClick={() => setCanPropose(true)}
            >
              Propose
            </button>
          )}
          {/* {deadline >= currentTime && (
            <div className=" mt-4 flex flex-col items-start ">
              <p className="text-rose-600 font-semibold text-sm">
                Share it with your lover
              </p>
              <div className="flex items-center mx-auto justify-center  mt-2">
                <FaTwitter className="cursor-pointer mr-4 bg-rose-200 text-rose-600 p-3 w-10 h-10 rounded-xl hover:bg-rose-300" />
                <FaEnvelope className="cursor-pointer bg-rose-200 text-rose-600 p-3 w-10 h-10 rounded-xl hover:bg-rose-300" />
              </div>
            </div>
          )} */}
        </div>
      </div>
    </>
  );
}
