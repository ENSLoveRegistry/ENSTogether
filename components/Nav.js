import { UserContext } from "../context/userContext";
import { useContext } from "react";
import Link from "next/link";

import { Connect } from "../components/Connect";
import { NetworkSwitcher } from "./NetworkSwitcher";
import { useNetwork } from "wagmi";
import AccMenu from "./AccMenu";

export default function Nav() {
  const { accountData } = useContext(UserContext);

  const [{ data: networkData, error: switchNetworkError }, switchNetwork] =
    useNetwork();

  if (accountData)
    return (
      <div className="fixed z-50 top-0  w-screen flex px-12 py-4 justify-between items-center mx-auto bg-rose-50 ">
        <Link passHref href={"/"}>
          <a>
            <h3 className="text-2xl text-rose-500 font-bold">ENSTogether</h3>
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
            <a>
              <span className="text-2xl bg-rose-100 py-2 px-4 rounded-xl hover:bg-rose-200 mr-4">
                📋
              </span>
            </a>
          </Link>

          <Link passHref href={"/propose"}>
            <a>
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
    <div className="fixed z-50 top-0  w-screen flex px-12 py-4 justify-between items-center mx-auto bg-rose-50 ">
      <Link passHref href={"/"}>
        <a>
          <h3 className="text-2xl text-rose-500 font-bold">ENSTogether</h3>
        </a>
      </Link>

      <Connect />
    </div>
  );
}
