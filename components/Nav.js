import { useContext } from "react";
import { UserContext } from "../context/userContext";
import Link from "next/link";
import { useNetwork } from "wagmi";

import { Connect } from "../components/Connect";
import { NetworkSwitcher } from "./NetworkSwitcher";
import AccMenu from "./AccMenu";

export default function Nav() {
  const { accountData } = useContext(UserContext);

  const [{ data: networkData, error: switchNetworkError }, switchNetwork] =
    useNetwork();

  if (accountData)
    return (
      <div className="fixed z-50 top-0 w-full flex px-4 md:px-6 lg:px-12  py-4 md:py-6 justify-between items-center mx-auto backdrop-blur-sm  ">
        <Link passHref href={"/"}>
          <a>
            <h3 className="text-xl sm:text-2xl text-rose-500 font-bold">
              ENSTogether
            </h3>
          </a>
        </Link>
        <div className="flex items-center">
          {switchNetwork && networkData.chain.id !== 5 && (
            <NetworkSwitcher
              networkData={networkData}
              switchNetwork={switchNetwork}
              switchNetworkError={switchNetworkError}
            />
          )}

          <Link passHref href={"/registry"}>
            <a className="hidden md:block">
              <span className="text-2xl bg-rose-100 py-2 px-4 rounded-xl hover:bg-rose-200 mr-4">
                📋
              </span>
            </a>
          </Link>

          <Link passHref href={"/propose"}>
            <a className="hidden md:block">
              <span className="text-2xl bg-rose-100 py-2 px-4 rounded-xl  hover:bg-rose-200">
                ❤️
              </span>
            </a>
          </Link>

          <AccMenu />
        </div>
      </div>
    );
  return (
    <div className="fixed z-50 top-0 w-full flex px-4 md:px-6 lg:px-12  py-4 md:py-6 justify-between items-center mx-auto  ">
      <Link passHref href={"/"}>
        <a>
          <h3 className="text-2xl text-rose-500 font-bold">ENSTogether</h3>
        </a>
      </Link>

      <Connect />
    </div>
  );
}
