import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { fromUnixTime, addSeconds } from "date-fns";
import { formatAddress } from "../utils/address";
import { CheckCircleIcon } from "@heroicons/react/solid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  useContractWrite,
  useEnsAvatar,
  useContract,
  useProvider,
  useEnsResolver,
  useSigner,
  useEnsResolveName,
} from "wagmi";

const abi = require("../config/ENSTogetherABI");
const contractAddress = require("../config/contractAddress");

export default function MakeProposal({
  currentAccount,
  setCanPropose,
  time,
  canPropose,
  mutate,
  p,
}) {
  const [searchENS, setSearchENS] = useState("");
  const [avatar, setAvatar] = useState("");
  const [processing, setProcessing] = useState(false);
  const [address, setAddress] = useState(res);
  const [error, setError] = useState("");
  const now = new Date().getTime();
  const options = { value: ethers.utils.parseEther("0.08") };

  const [proposalDone, write] = useContractWrite(
    {
      addressOrName: contractAddress,
      contractInterface: abi,
    },
    "propose",
    {
      args: [address, options],
    }
  );
  const [{ data: res }] = useEnsResolver({
    name: searchENS,
  });
  const [{ data: ava }] = useEnsAvatar({
    addressOrName: searchENS,
  });
  const [{ data: ensLoveR }] = useEnsResolveName({
    name: searchENS,
  });
  const provider = useProvider();
  const contract = useContract({
    addressOrName: contractAddress,
    contractInterface: abi,
    signerOrProvider: provider,
  });
  const [_, getSigner] = useSigner({
    skip: true,
  });

  const hash = proposalDone?.data?.hash;

  const searchForENS = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError("");
    const dateCreated = fromUnixTime(p?.createdAt).getTime();
    const deadline = addSeconds(dateCreated, time).getTime();
    if (searchENS == "") {
      setProcessing(false);
      setError("Enter something");
      return;
    } else if (searchENS.length > 0 && address == null) {
      setProcessing(false);
      setError("Not an ENS domain");
      return;
    } else if (p?.relationshipStatus === 1 || p?.relationshipStatus === 2) {
      setProcessing(false);
      setError(`${searchENS} is alredy registered, sorry :/`);
    } else if (deadline < now && !canPropose) {
      setProcessing(false);
      setError(`${searchENS} has a pending proposal from other person`);
    } else if (address.toLowerCase() == currentAccount.toLowerCase()) {
      setProcessing(false);
      setError("Cant propose to yourself!");
      return;
    } else propose();
  };
  const propose = async () => {
    setError("");
    try {
      const signer = await getSigner();
      let message = `Send a proposal to ${searchENS}`;
      await signer.signMessage(message);

      const result = await write().then(
        contract.on("ProposalSubmitted", (to, from) => {
          if (currentAccount == from) {
            toast.success(`Sending a Love Proposal to ${searchENS} `, {
              toastId: "proposal_submitted",
            });
          }
        })
      );
      // console.log(result);
      const tx = await result?.data?.wait();
      // console.log(tx);
      if (tx?.confirmations >= 1) {
        setCanPropose(false);
        toast.success(`transaction confirmed`, {
          toastId: "transactionConfirmed",
        });
        setProcessing(false);
        mutate();
        return;
      }
    } catch (err) {
      setProcessing(false);
      handleMMerror(err);
      return;
    }
  };

  const handleMMerror = async (err) => {
    const code = await err.code;
    switch (code) {
      case 4001:
        toast.error("Transaction rejected by user");
        break;
      case 32603:
        toast.error("Transaction rejected by user");
        break;
      default:
        toast.error("Internal error");
        break;
    }
  };

  useEffect(() => {
    const adda = async () => {
      if (res !== undefined && res?.address.length) {
        const a = await res.getAddress();
        setAddress(a);
      } else setAddress(null);
    };
    if (ava) {
      setAvatar(ava);
    } else setAvatar(null);

    adda();
    return () => {};
  }, [res, ava]);

  return (
    <>
      <div className=" flex flex-1 px-8 justify-center items-center min-h-screen md:pt-20 lg:pt-0 max-w-lg mx-auto  ">
        <form
          onSubmit={searchForENS}
          className="shadow shadow-rose-300/50 flex flex-col justify-center items-center p-8 md:p-10 lg:p-12 bg-rose-100 rounded-2xl space-y-4 w-full "
        >
          <label
            htmlFor="text"
            className="block  font-medium text-rose-500 text-2xl"
          >
            Propose to
          </label>
          {avatar && (
            <img src={avatar} alt="" className="w-14 h-14 rounded-full" />
          )}
          {ensLoveR && (
            <p className="font-medium text-rose-600 text-xs">
              {formatAddress(ensLoveR)}
            </p>
          )}

          <div className="mt-4 relative rounded-full shadow-lg shadow-rose-200/50  ">
            <input
              type="text"
              autoComplete="text"
              autoCorrect="false"
              name="text"
              id="text"
              className="apparence-none placeholder-rose-400 py-2 px-4 block w-72 border-rose-500 rounded-full bg-rose-50 text-rose-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="mylover.eth"
              onChange={(e) => {
                setSearchENS(e.target.value), setError("");
              }}
            />
            {res && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <CheckCircleIcon
                  className="h-5 w-5 text-emerald-400"
                  aria-hidden="true"
                />
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={processing}
            className="rounded-full w-72 font-bold text-xl bg-rose-400 text-white py-2 mt-2 flex items-center justify-center disabled:opacity-60 hover:bg-rose-500"
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
            {processing ? "Processing..." : "Send "}
          </button>
          <span className="flex justify-center text-rose-600 text-xs tracking-tight font-semibold">
            Pay 0.08 ETH
          </span>
          {hash && (
            <a
              href={`https://goerli.etherscan.io/tx/${hash}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="flex justify-center text-xs text-center text-rose-600 font-semibold underline">
                View on Goerli
              </span>
            </a>
          )}
          {proposalDone?.error &&
            (() => setProcessing(false),
            (
              <div className="bg-rose-200 py-1 px-6 rounded-md border border-rose-600 text-rose-600 max-w-md ">
                {proposalDone.error?.error?.message
                  ? proposalDone.error?.error?.message
                  : proposalDone.error.message}
              </div>
            ))}
          {error && (
            <span className="bg-rose-200 py-1 px-6 text-rose-600 rounded-md border border-rose-600 text-center">
              {error}
            </span>
          )}
        </form>
      </div>
    </>
  );
}
