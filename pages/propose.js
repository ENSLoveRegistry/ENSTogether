import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/userContext";
import { useNetwork } from "wagmi";
import Link from "next/link";

//Components
import MakeProposal from "../components/MakeProposal";
import ProposalToRespond from "../components/RespondToProposal";
import PendingProposal from "../components/PendingProposal";
import UnionModal from "../components/UnionModal";

//notification
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAccount } from "wagmi";

import { fromUnixTime, addSeconds } from "date-fns";

export default function Propose() {
  const { time, union, mutate } = useContext(UserContext);
  const [querying, setQuerying] = useState(true);
  const [canPropose, setCanPropose] = useState(false);
  const now = new Date().getTime();

  const [{ data: accountData, error, loading }] = useAccount({
    fetchEns: true,
  });

  let p = union?.data;

  const [{ data: networkData }] = useNetwork();

  useEffect(() => {
    const checkProposalsMade = async () => {
      const createdAt = p?.createdAt;
      const dateCreated = fromUnixTime(createdAt).getTime();
      const deadline = addSeconds(dateCreated, time).getTime();

      if (now > deadline && p?.proposalStatus == 1) {
        setCanPropose(true);
        return;
      } else if (
        p?.relationshipStatus !== 3 &&
        p?.proposalStatus !== 0 &&
        p?.proposalStatus !== 3
      ) {
        setCanPropose(false);
        return;
      } else setCanPropose(true);
    };

    if (p) {
      checkProposalsMade().then(() => setQuerying(false));
      return;
    }
    return;
  }, [p]);

  const contextClass = {
    success: "bg-emerald-100 text-emerald-600 flex",
    error: "bg-rose-100 text-rose-600 flex",
  };
  if (querying || networkData?.chain?.id !== 1) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center min-h-screen">
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
        <h1 className="text-2xl text-rose-600 text-center tracking-tighter mt-4">
          Not connected or wrong network
        </h1>
      </div>
    );
  }

  if (!accountData?.ens && !loading) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center min-h-screen">
        <h1 className="text-2xl text-rose-600 text-center">
          Please purchase or configure your ENS name to enter this registry
        </h1>
        <Link href={"https://app.ens.domains/"} passHref>
          <a
            rel="noopener noreferrer"
            target="_blank"
            className="mt-8 text-xl text-rose-600 rounded-3xl px-4 py-2 border bg-rose-100 border-rose-600 hover:bg-rose-200"
          >
            Go to ENS domains
          </a>
        </Link>
      </div>
    );
  }

  return (
    <div>
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

      <div>
        {p?.from == accountData?.address &&
          !querying &&
          p?.relationshipStatus == 0 &&
          !canPropose &&
          !p?.expired && (
            <PendingProposal
              proposalsMade={p}
              to={p?.to}
              setCanPropose={setCanPropose}
              currentAccount={accountData?.address}
              time={time}
              mutate={mutate}
            />
          )}
        {p?.to == accountData?.address &&
          !p?.expired &&
          !querying &&
          !canPropose &&
          p?.relationshipStatus == 0 && (
            <ProposalToRespond
              proposalsMade={p}
              currentAccount={accountData?.address}
              time={time}
              from={p?.from}
              setCanPropose={setCanPropose}
              mutate={mutate}
            />
          )}
        {p?.relationshipStatus !== 0 &&
          p?.relationshipStatus !== 3 &&
          !canPropose &&
          !querying && (
            <UnionModal
              un={p}
              currentAccount={accountData?.address}
              setCanPropose={setCanPropose}
              mutate={mutate}
              s={p?.relationshipStatus}
            />
          )}
        {!querying &&
          canPropose &&
          p?.relationshipStatus != 1 &&
          p?.relationshipStatus != 2 && (
            <MakeProposal
              currentAccount={accountData?.address}
              setCanPropose={setCanPropose}
              time={time}
              canPropose={canPropose}
              p={p}
              mutate={mutate}
            />
          )}
      </div>
    </div>
  );
}
