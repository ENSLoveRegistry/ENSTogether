import { useContext } from "react";
import { UnitedContext } from "../context/registryContext";
import RegistryTable from "../components/Registry";
import { useNetwork } from "wagmi";

export default function Registry() {
  const { proposalsCounter, registryCounter } = useContext(UnitedContext);

  const [{ data: networkData }] = useNetwork();

  return (
    <div className="flex">
      <div className="fixed z-30 top-0 left-0 bottom-0 flex flex-col items-center justify-center min-h-scren text-rose-700 w-92 pl-24">
        <div className="flex flex-col p-10 bg-rose-100 rounded-3xl items-start">
          <p className="text-2xl font-light">Love Proposals:</p>
          <p className="text-rose-600 font-bold text-6xl">{proposalsCounter}</p>
        </div>
        <div className="flex flex-col p-10 bg-rose-100 rounded-3xl items-start mt-12">
          <p className="text-2xl font-light">Registry Count:</p>
          <p className="text-rose-600 font-bold text-6xl">{registryCounter}</p>
        </div>
      </div>

      <div className="max-w-screen flex flex-1 pl-72 justify-center items-center mx-auto min-h-screen">
        {networkData?.chain?.id !== 5 ? (
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
        ) : (
          <RegistryTable />
        )}
      </div>
    </div>
  );
}
