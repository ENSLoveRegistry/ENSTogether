import { useContext } from "react";
import { UnitedContext } from "../context/registryContext";
import RegistryTable from "../components/Registry";

export default function Registry() {
  const { proposalsCounter, registryCounter } = useContext(UnitedContext);

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
        <RegistryTable />
      </div>
    </div>
  );
}
