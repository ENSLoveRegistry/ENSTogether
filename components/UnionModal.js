import { ethers } from "ethers";
import { useState, useEffect, Fragment } from "react";
import { fromUnixTime, format } from "date-fns";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { useEnsLookup, useWaitForTransaction } from "wagmi";
import { toast } from "react-toastify";
import Image from "next/image";

const abi = require("../config/United");
const contractAddress = require("../config/contractAddress");

const status = ["together", "paused", "separated"];

const UnionModal = ({ currentAccount, readUnion, setCanPropose, mutate }) => {
  const [union, setUnion] = useState(null);
  const [updateTo, setUpdateTo] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [image, setImage] = useState(null);
  const [processing, setProcessing] = useState(false);

  const date = union ? fromUnixTime(union?.createdAt).getTime() : 0;
  const formattedDate = format(date, "MMM do yyyy");

  const [{ data: ensName }] = useEnsLookup({
    address: currentAccount == union?.from ? union?.to : union?.from,
  });
  const [{ data: tCompleted, error }, wait] = useWaitForTransaction({
    skip: true,
  });

  const updateStatus = async () => {
    setProcessing(true);
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const options = { value: ethers.utils.parseEther("0.005") };

    let num;
    //Status check
    if (
      (union.currentStatus.toString() == "0" && updateTo == "together") ||
      (union.currentStatus.toString() == "1" && updateTo == "paused")
    ) {
      setProcessing(false);
      toast.error(
        `You need to select a new status. Current status: ${updateTo} `
      );
      return;
    } else if (updateTo == "together") {
      num = 0;
    } else if (updateTo == "paused") {
      num = 1;
    } else if (updateTo == "separated") {
      num = 2;
    }

    try {
      let message = `Sign to update your status to ${updateTo}`;
      const signed = await signer.signMessage(message);
      const tx = await contract.updateUnion(num, options);
      wait({ hash: tx.hash })
        .then(() => {
          setProcessing(false),
            toast.success(
              `Success, you've updated the status to: ${updateTo}`,
              {
                toastId: "statusUpdated",
              }
            );
          if (num == 2) {
            setCanPropose(true);
            mutate();
            return;
          }
        })
        .then(() => {
          readUnion();
          return;
        });
    } catch (error) {
      handleMMerror(error);
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
        toast.error(err);
        break;
    }
  };

  const getTokenId = async () => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const res = await contract.getTokenIDS(currentAccount);
    const tokenId = res[res.length - 1].toNumber();
    const tokenURI = await contract.getTokenUri(tokenId);
    const json = Buffer.from(tokenURI.substring(29), "base64").toString();
    const result = JSON.parse(json);
    setImage(result.image);
  };

  useEffect(() => {
    const check = async () => {
      const res = await readUnion();
      setUnion(res?.data);
      if (res && res?.data?.currentStatus.toString() == "0") {
        setUpdateTo(status[0]);
        setCurrentStatus("together");
        getTokenId();
      } else if (res && res?.data?.currentStatus.toString() == "1") {
        setUpdateTo(status[1]);
        setCurrentStatus("paused");
        getTokenId();
      }
      return res;
    };

    check();
    return () => {};
  }, [tCompleted]);

  return (
    <div className=" flex flex-col justify-center space-y-10 mt-16 md:mt-16 md:space-y-0 lg:mt-0 md:flex-row md:justify-between items-center min-h-screen md:space-x-12 text-rose-600 md:mx-auto md:max-w-2xl ">
      <div className="flex flex-col w-72">
        <h1 className="font-bold text-4xl">Registered!</h1>
        <p className="mt-8">
          With: {ensName ? ensName : "loading..."}
          <br />
          Since: {date !== 0 && formattedDate}
        </p>
        <p className="">Currently: {currentStatus} </p>
        <div className=" mt-8">
          <p className="font-medium">Change your status: </p>
          <Listbox value={updateTo} onChange={setUpdateTo}>
            <div className="relative mt-2 z-20">
              <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg  cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
                <span className="block truncate">{updateTo}</span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <SelectorIcon
                    className="w-5 h-5 text-rose-800"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-gray-50 rounded-md shadow-lg shadow-rose-300/50 max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {status.map((st, stIndex) => (
                    <Listbox.Option
                      key={stIndex}
                      className={({ active }) =>
                        `${
                          active ? "text-rose-800 bg-rose-100" : "text-rose-700"
                        }
                          cursor-default select-none relative py-2 pl-4 pr-4`
                      }
                      value={st}
                    >
                      {({ updateTo, active }) => (
                        <>
                          <span
                            className={`${
                              updateTo ? "font-medium" : "font-normal"
                            } block truncate`}
                          >
                            {st}
                          </span>
                          {updateTo ? (
                            <span
                              className={`${
                                active ? "text-red-600" : "text-amber-600"
                              }
                                absolute inset-y-0 left-0 flex items-center `}
                            >
                              <CheckIcon
                                className="w-5 h-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
          <button
            className="bg-rose-500 text-rose-50 font-bold py-2 px-4 rounded-full mt-4 flex items-center justify-center disabled:opacity-60 hover:bg-rose-600"
            disabled={processing}
            onClick={updateStatus}
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
            {processing ? "Processing..." : "Update"}
          </button>
        </div>
      </div>
      {image ? (
        <div className="w-80 h-80">
          <Image
            width={300}
            height={300}
            alt=""
            layout="responsive"
            objectFit="contain"
            src={image}
            className="rounded-xl"
          />
        </div>
      ) : (
        <div className="rounded-xl w-72 h-72 bg-rose-100" />
      )}
    </div>
  );
};

export default UnionModal;
