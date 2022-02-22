import { useContext } from "react";
import { UserContext } from "../context/userContext";
import Link from "next/link";
import { useNetwork } from "wagmi";
import { Connect } from "../components/Connect";
import { NetworkSwitcher } from "./NetworkSwitcher";
import AccMenu from "./AccMenu";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Nav() {
  const { accountData } = useContext(UserContext);

  const [{ data: networkData, error: switchNetworkError }, switchNetwork] =
    useNetwork();

  const contextClass = {
    success: "bg-emerald-100 text-emerald-600 flex",
    error: "bg-rose-100 text-rose-600 flex",
  };

  if (switchNetworkError != undefined) {
    toast.error(switchNetworkError?.message, { toastId: "networkError" });
  }

  if (accountData)
    return (
      <>
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

        <div className="fixed z-50 top-0 w-full flex px-4 md:px-6 lg:px-12  py-4 md:py-6 justify-between items-center mx-auto backdrop-blur-sm  ">
          <Link passHref href={"/"}>
            <a>
              <h3 className="text-xl sm:text-2xl text-rose-500 font-bold">
                ENSTogether
              </h3>
            </a>
          </Link>
          <div className="flex items-center">
            {switchNetwork && networkData.chain.id !== 1 && (
              <NetworkSwitcher
                networkData={networkData}
                switchNetwork={switchNetwork}
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
      </>
    );
  return (
    <div className="fixed z-50 top-0 w-full flex px-4 md:px-6 lg:px-12  py-4 md:py-6 justify-between items-center mx-auto  ">
      <Link passHref href={"/"}>
        <a>
          <h3 className="text-2xl text-rose-500 font-bold">ENSTogether</h3>
        </a>
      </Link>
      <div className="flex items-center">
        <Link passHref href={"/registry"}>
          <a className="hidden md:block">
            <span className="text-2xl bg-rose-100 py-2 px-4 rounded-xl hover:bg-rose-200 mr-4">
              📋
            </span>
          </a>
        </Link>
        <Link passHref href={"/propose"}>
          <a className="hidden md:block">
            <span className="text-2xl bg-rose-100 py-2 px-4 rounded-xl  hover:bg-rose-200 mr-4">
              ❤️
            </span>
          </a>
        </Link>

        <Connect />
      </div>
    </div>
  );
}
