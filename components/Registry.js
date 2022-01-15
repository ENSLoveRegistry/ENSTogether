import { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { UnitedContext } from "../context/registryContext";
import { fromUnixTime, format } from "date-fns";
import { HeartIcon } from "@heroicons/react/solid";

export default function RegistryTable() {
  const { unions } = useContext(UnitedContext);
  const [allUnions, setAllUnions] = useState(null);

  const convertToENS = async (add) => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const converted = await provider.lookupAddress(add);
    return converted;
  };

  const formatDate = (d) => {
    const date = fromUnixTime(d);
    const formattedDate = format(date, "MM/dd/yy");
    return formattedDate;
  };

  const statusCheck = (s) => {
    let status;
    switch (s) {
      case "0":
        status = "Together";
        break;
      case "1":
        status = "Paused";
        break;
      case "2":
        status = "Separated";
      default:
        "";
    }
    return status;
  };

  const formatUnion = (unions) => {
    let uArray = [];
    let promiseArr = unions?.unions.map(async (u, i) => {
      const { from, to, currentStatus, createdAt, registryNumber, id } = u;
      const ensFrom = await convertToENS(from);
      const ensTo = await convertToENS(to);
      const date = formatDate(createdAt);
      const status = statusCheck(currentStatus);
      const union = {
        i,
        id,
        ensFrom,
        ensTo,
        date,
        currentStatus,
        registryNumber,
        status,
      };
      uArray.push(union);
    });
    Promise.all(promiseArr).then(() => setAllUnions(uArray));
  };

  useEffect(() => {
    if (unions?.unions) {
      formatUnion(unions);
    }
  }, [unions]);

  if (!allUnions) {
    return (
      <div className="flex justify-center">
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
    <div className="flex flex-col bg-rose-100 px-8 py-4 w-full rounded-3xl max-w-2xl mt-8">
      {allUnions?.length > 0 &&
        allUnions.map((u) => {
          {
            return (
              <div
                key={u.id}
                className="flex items-center justify-between py-4 text-rose-500"
              >
                <HeartIcon className="h-5 w-5 col-span-1 " />
                <span className="">{u.date}</span>
                <div className="flex items-center justify-start">
                  <span className="h-10 w-10 rounded-full bg-rose-200 mr-4"></span>
                  <span className="">{u.ensFrom}</span>
                </div>
                <div className="flex items-center justify-start">
                  <span className="h-10 w-10 rounded-full bg-rose-200 mr-4"></span>
                  <span className="">{u.ensTo}</span>
                </div>
                {/* <span className="col-span-2">{u.registryNumber}</span> */}
              </div>
            );
          }
        })}
    </div>
  );
}
