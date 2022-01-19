import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";

import {
  useContractWrite,
  useEnsAvatar,
  useContract,
  useWaitForTransaction,
  useProvider,
  useEnsResolver,
} from "wagmi";

const abi = require("../config/United");
const contractAddress = require("../config/contractAddress");

export default function MakeProposal({ currentAccount, setCanPropose, read }) {
  const [searchENS, setSearchENS] = useState("");
  const [avatar, setAvatar] = useState("");
  const [processing, setProcessing] = useState(false);
  const [address, setAddress] = useState(res);
  const [error, setError] = useState("");
  const options = { value: ethers.utils.parseEther("0.01") };

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
  const provider = useProvider();
  const contract = useContract({
    addressOrName: contractAddress,
    contractInterface: abi,
    signerOrProvider: provider,
  });
  const [waitResult] = useWaitForTransaction({
    wait: proposalDone.data?.wait,
  });

  const searchForENS = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError("");

    if (searchENS == "") {
      setProcessing(false);
      setError("Enter something");
      return;
    } else if (searchENS.length > 0 && address == null) {
      setProcessing(false);
      setError("Not an ENS domain");
      return;
    } else if (address.toLowerCase() == currentAccount.toLowerCase()) {
      setProcessing(false);
      setError("Cant propose to yourself!");
      return;
    } else propose();
  };
  const propose = async () => {
    setError("");
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    try {
      const signer = provider.getSigner();
      let message = `Send a proposal to ${searchENS}`;
      await signer.signMessage(message);
    } catch (err) {
      setProcessing(false);
      handleMMerror(err);
      return;
    }

    const result = await write().then(() =>
      contract.on("ProposalSubmitted", () => {
        toast.success(`Success, you made a proposal to ${searchENS} `, {
          toastId: "proposalSubmitted",
        });
        read();
      })
    );
    const tx = await result;
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
      }
    };
    if (ava) {
      setAvatar(ava);
    }
    if (waitResult?.data?.status >= 1) {
      setCanPropose(false);
      toast.success(`transaction confirmed`, {
        toastId: "transactionConfirmed",
      });
      setProcessing(false);

      return;
    }
    adda();
    return;
  }, [res, ava, waitResult]);

  const hash = proposalDone?.data?.hash;

  return (
    <div className="flex flex-1 px-8 justify-center items-center min-h-screen md:pt-12 max-w-lg mx-auto  ">
      <form
        onSubmit={searchForENS}
        className="flex flex-col p-8 md:p-10 lg:p-12 bg-rose-100 rounded-2xl space-y-4 w-full "
      >
        {/* <img
          src={avatar}
          alt={`Pfp NFT of ${ensName}`}
          className="w-12 h-12 rounded-xl"
        /> */}

        <label
          htmlFor="ensSearch"
          className="block  font-medium text-rose-500 text-2xl"
        >
          Propose to
        </label>
        <div className="mt-4">
          <input
            type="text"
            id="ensSearch"
            className="placeholder-rose-400 shadow-sm shadow-rose-200/50 p-4 block w-full border-rose-500 rounded-full bg-rose-50 text-rose-600 focus:ring-rose-400 active:ring-rose-400 selected:ring-rose-400 "
            placeholder="mylover.eth"
            onChange={(e) => {
              setSearchENS(e.target.value), setError("");
            }}
          />
        </div>
        <button
          type="submit"
          disabled={processing}
          className="rounded-full font-bold text-xl bg-rose-400 text-white py-2 mt-2 flex items-center justify-center disabled:opacity-60 hover:bg-rose-500"
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
          Pay 0.01 ETH
        </span>
        {hash && (
          <a
            href={`https://goerli.etherscan.io/tx/${hash}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="flex justify-center text-sm text-center text-rose-600 font-semibold underline">
              View on Goerli
            </span>
          </a>
        )}
        {proposalDone?.error && <div>{proposalDone.error.message}</div>}
        {error && <h2 className="text-rose-600 mt-4">{error}</h2>}
      </form>
    </div>
  );
}
