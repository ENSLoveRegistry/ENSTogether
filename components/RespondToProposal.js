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
  currentAccount,
  read,
  setCanPropose,
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
      const tx = await contract.respondToProposal(1, t, f).then(() => {
        contract.on("ProposalResponded", () => {
          toast.success("💍 You are getting registered!", {
            toastId: "declined",
          });
        });
        contract.on("GotUnited", () => {
          setProcessing(false);
          toast.success("You're officially registered!", { toastId: "united" });
          read();
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
          toast.success("Proposal succesfully declined", {
            toastId: "declined",
          });
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
  }, [deadline, currentTime]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4 ">
      {deadline > currentTime ? (
        <Timer deadline={deadline} />
      ) : (
        <span className="text-rose-600 text-4xl font-bold"> Expired :( </span>
      )}
      {deadline > currentTime && (
        <h2 className=" text=xl md:text-2xl text-rose-600 mt-8 px-8">
          Congratulations, someone loves you!
        </h2>
      )}

      <div className="shadow shadow-rose-300/50 mt-8 flex flex-col space-y-2 justify-center items-center text-center p-8 bg-rose-100 text-rose-600 rounded-3xl max-w-lg text-xl">
        <p>
          One proposal made from <span className="font-bold">{f} </span>
        </p>
        <p>Sent on: {formattedDate}</p>
        <p>
          Status:{" "}
          {deadline < currentTime ? (
            <span className="font-bold">Expired</span>
          ) : (
            <span className="font-bold">Pending</span>
          )}
        </p>
        {deadline > currentTime ? (
          <div className="flex justify-center">
            <button
              onClick={decline}
              disabled={processing && response == "decline"}
              className=" rounded-full font-bold text-xl bg-rose-200 px-8 text-rose-400 py-2 mt-4 mr-4 flex items-center justify-center disabled:opacity-60 hover:bg-rose-500 hover:text-rose-50"
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
              {processing && response == "decline"
                ? "Processing..."
                : "Decline"}
            </button>
            <button
              onClick={accept}
              disabled={processing && response == "accept"}
              className="w=[72px] rounded-full font-bold text-xl bg-rose-400 text-white py-2 px-8 mt-4 flex items-center justify-center disabled:opacity-60 hover:bg-rose-500"
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
            className=" rounded-full font-bold text-xl bg-rose-400 px-8 text-white py-2 mt-4 flex items-center justify-center disabled:opacity-60 hover:bg-rose-500"
            onClick={() => setCanPropose(true)}
          >
            Propose
          </button>
        )}
      </div>
    </div>
  );
}
