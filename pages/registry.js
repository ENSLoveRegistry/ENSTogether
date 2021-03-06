import { useContext } from "react";
import { UnitedContext } from "../context/registryContext";
import RegistryTable from "../components/Registry";

export default function Registry() {
  const { proposalsCounter, registryCounter } = useContext(UnitedContext);

  return (
    <>
      <div className="space-y-4 px-4 min-h-screen pt-10 sm:pt-24 lg:pt-0 lg:flex lg:flex-col lg:justify-center items-center  ">
        <div className="flex flex-col space-y-4 mt-12 sm:flex-row sm:justify-between sm:mt-2 sm:space-y-0 md:mt-0 md:justify-center md:space-x-10  lg:fixed lg:z-30 top-0 left-0 bottom-0  lg:flex-col lg:items-center lg:justify-center lg:min-h-scren lg:space-x-0 lg:space-y-8 text-rose-700 lg:w-92 lg:pl-20 lg:pr-12">
          <div className="shadow shadow-rose-300/50 flex flex-col px-8 py-4 sm:mr-8 sm:p-10 bg-rose-100 sm:bg-rose-100 rounded-3xl items-start md:mr-0">
            <p className="text-2xl font-light">Love Proposals:</p>
            <p className="text-rose-600 font-bold text-6xl">
              {proposalsCounter}
            </p>
          </div>
          <div className=" shadow shadow-rose-300/50  flex flex-col px-8 py-4 sm:p-10 bg-rose-100 sm:bg-rose-100 rounded-3xl items-start ">
            <p className="text-2xl font-light">Registry Count:</p>
            <p className="text-rose-600 font-bold text-6xl">
              {registryCounter}
            </p>
          </div>
        </div>

        <div className=" lg:flex lg:pl-72 lg:justify-center lg:items-center lg:mx-auto lg:py-24 ">
          <RegistryTable />
        </div>
      </div>
    </>
  );
}
