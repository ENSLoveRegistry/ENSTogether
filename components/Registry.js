import { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { UnitedContext } from "../context/registryContext";
import { fromUnixTime, format } from "date-fns";
import { HeartIcon } from "@heroicons/react/solid";

export default function RegistryTable() {
  const { unions } = useContext(UnitedContext);
  const [allUnions, setAllUnions] = useState(null);
  console.log(allUnions);

  const convertToENS = async (add) => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const converted = await provider.lookupAddress(add);
    const resolver = await provider.getResolver(converted);
    const avatar = await resolver.getAvatar();
    return [converted, avatar];
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
        ensFrom: ensFrom[0],
        ensTo: ensTo[0],
        avatarFrom: ensFrom[1].url,
        avatarTo: ensTo[1].url,
        date,
        currentStatus,
        registryNumber,
        status,
      };
      uArray.push(union);
    });
    Promise.all(promiseArr).then(() =>
      setAllUnions(uArray.sort((a, b) => b.registryNumber - a.registryNumber))
    );
  };
  useEffect(() => {
    if (unions?.unions) {
      formatUnion(unions);
    }
  }, [unions]);

  if (!allUnions) {
    return (
      <div className="flex justify-center items-center min-h-max">
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
    <>
      <div className="hidden md:flex flex-col justify-center  rounded-3xl bg-rose-100 shadow-md shadow-rose-300/40 overflow-y-auto mt-6 lg:mt-0">
        <table className="rounded-full divide-y divide-rose-200 ">
          <tbody className=" divide-y divide-rose-200 text-rose-500 ">
            {allUnions?.length > 0 &&
              allUnions.map((u) => (
                <tr key={u.id} className="p-1  ">
                  <td className="px-6 py-2  ">
                    <div className="flex items-center rounded-3xl ">
                      <div className="flex items-center justify-center rounded-3xl ">
                        <span className="mr-2">{u.registryNumber}</span>
                        <HeartIcon className="h-5 w-5 " />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm  ">{u.date}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-2 ">
                    {u?.avatarFrom ? (
                      <img
                        src={u.avatarFrom}
                        className="w-8 h-8 lg:w-10 lg:h-10 object-cover rounded-full text-transparent mr-1"
                        alt={`${u.ensFrom} profile avatar`}
                      />
                    ) : (
                      <span className="h-10 w-10 rounded-full bg-rose-200 mr-4" />
                    )}
                  </td>
                  <td className="px-6 py-2 ">
                    <span className="px-2 inline-flex text-sm leading-5  ">
                      {u.ensFrom}
                    </span>
                  </td>
                  <td className="px-6 py-2  text-sm text-gray-500">
                    {u?.avatarTo ? (
                      <img
                        src={u.avatarTo}
                        className="w-8 h-8 lg:w-10 lg:h-10 object-cover rounded-full text-transparent mr-1"
                        alt={`${u.avatarTo} profile avatar`}
                      />
                    ) : (
                      <span className="h-10 w-10 rounded-full bg-rose-200 mr-4" />
                    )}
                  </td>
                  <td className="px-6 py-2 text-left  ">
                    <span className="px-2 inline-flex text-sm leading-5  ">
                      {u.ensTo}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 pb-8 md:hidden ">
        {allUnions?.length > 0 &&
          allUnions.map((u) => {
            {
              return (
                <div
                  key={u.id}
                  className="shadow shadow-rose-300/40 flex flex-col space-y-4 bg-rose-100 items-center justify-between py-4 px-8 rounded-3xl text-rose-500"
                >
                  <div className="flex w-full justify-between">
                    <div className="flex items-center">
                      <span className="mr-2">{u.registryNumber}</span>
                      <HeartIcon className="h-5 w-5 " />
                    </div>

                    <span className="">{u.date}</span>
                  </div>
                  <div className="flex w-full justify-between">
                    <div className="flex items-center justify-start">
                      {u?.avatarFrom ? (
                        <img
                          src={u.avatarFrom}
                          className="w-8 h-8 lg:w-10 lg:h-10 object-cover rounded-full text-transparent mr-1"
                          alt={`${u.avatarFrom} profile avatar`}
                        />
                      ) : (
                        <span className="h-10 w-10 rounded-full bg-rose-200 mr-4" />
                      )}

                      <span className="">{u.ensFrom}</span>
                    </div>
                    <div className="flex items-center justify-start">
                      {u?.avatarTo ? (
                        <img
                          src={u.avatarTo}
                          className="w-8 h-8 lg:w-10 lg:h-10 object-cover rounded-full text-transparent mr-1"
                          alt={`${u.avatarTo} profile avatar`}
                        />
                      ) : (
                        <span className="h-10 w-10 rounded-full bg-rose-200 mr-4" />
                      )}
                      <span className="">{u.ensTo}</span>
                    </div>
                  </div>
                </div>
              );
            }
          })}
      </div>
    </>
  );
}
