import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { fromUnixTime, format, addSeconds } from "date-fns";
import Timer from "./Timer";
import { toast } from "react-toastify";
import { useEnsLookup } from "wagmi";

const abi = require("../config/United");
const contractAddress = require("../config/contractAddress");

export default function ProposalToRespond({
  proposalsMade,
  time,
  from,
  readUnion,
  read,
  currentAccount,
}) {
  //state
  const { createdAt } = proposalsMade;
  const [processing, setProcessing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().getTime());
  const [response, setResponse] = useState("");
  //format data
  const dateCreated = fromUnixTime(createdAt).getTime();
  const formattedDate = format(dateCreated, "MMM do yyyy");
  const deadline = addSeconds(dateCreated, time).getTime();

  const [{ data: f }] = useEnsLookup({
    address: from,
  });
  const [{ data: t }] = useEnsLookup({
    address: currentAccount,
  });
  const accept = async () => {
    setProcessing(true);
    setResponse("accept");
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      await contract.respondToProposal(1, t, f).then(() => {
        contract.on("ProposalResponded", () => {
          toast.success("Nice!, you are getting united!");
        });
        contract.on("GotUnited", () => {
          setProcessing(false);
          toast.success("You're officially united!");
          readUnion();
        });
      });
    } catch (err) {
      handleMMerror(err);
    }
  };

  const decline = async () => {
    setProcessing(true);
    setResponse("decline");
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const r = await contract.respondToProposal(2, t, f).then(() =>
        contract.on("ProposalCancelled", () => {
          setProcessing(false);
          toast.success("Proposal succesfully declined");
          read();
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
        toast.error("Transaction rejected by user");
        break;
      default:
        toast.error(err.message);
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

  return (
    <div className="flex flex-col bg-gray-300 rounded-2xl p-12 ">
      <h2>Congratulations, someone loves you</h2>
      {deadline < currentTime ? <p>Expired!</p> : <Timer deadline={deadline} />}
      <h3>
        One proposal made from <span className="font-bold">{f} </span>{" "}
      </h3>
      <h4>Sent on: {formattedDate}</h4>
      <h4>Status: {deadline < currentTime ? "Expired" : "Pending"}</h4>
      {deadline > currentTime ? (
        <div className="flex">
          <button
            onClick={decline}
            disabled={processing && response == "decline"}
            className="py-2 px-4 bg-stone-300 text-green-500 rounded-full mr-6 flex items-center justify-center disabled:opacity-60"
          >
            {processing && response == "decline" && (
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
            {processing && response == "decline" ? "Processing..." : "Decline"}
          </button>
          <button
            onClick={accept}
            disabled={processing && response == "accept"}
            className="py-2 px-4 bg-stone-300 text-yellow-500 rounded-full flex items-center justify-center disabled:opacity-60"
          >
            {processing && response == "accept" && (
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
            {processing && response == "accept" ? "Processing..." : "Accept"}
          </button>
        </div>
      ) : (
        <button
          className="py-2 px-4 bg-stone-300 text-yellow-500 rounded-full flex items-center justify-center disabled:opacity-60"
          onClick={() => setProposalToApprove(null)}
        >
          Propose
        </button>
      )}
    </div>
  );
}
