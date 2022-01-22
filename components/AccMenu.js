import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { formatAddress } from "../utils/address";
import Link from "next/link";

export default function AccMenu() {
  const router = useRouter();
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  });

  return (
    <div className="w-48 sm:w-56 text-right ">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="px-3 sm:px-4 py-2 text-xs font-medium text-white bg-black rounded-full bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            <div className="flex items-center ">
              {/* AVATAR */}
              {accountData?.ens?.avatar ? (
                <img
                  src={accountData.ens.avatar}
                  alt="ENS profile picture avatar"
                  className="w-8 h-8 lg:w-10 lg:h-10 object-cover rounded-full text-transparent"
                />
              ) : (
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-orange-200 "></div>
              )}

              <div className="flex flex-col justify-start px-1">
                {accountData?.ens?.name && (
                  <h5 className="font-bold text-xs sm:text-md">
                    {accountData?.ens?.name}
                  </h5>
                )}
                {accountData?.address && (
                  <h6 className="text-xs">
                    {formatAddress(accountData?.address)}
                  </h6>
                )}
              </div>

              <ChevronDownIcon
                className="w-5 h-5 ml-2 -mr-1 text-white-200 hover:text-violet-100"
                aria-hidden="true"
              />
            </div>
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 w-40 mt-3 origin-top-right bg-rose-100 rounded-3xl shadow-lg shadow-rose-300/50 ring-1 ring-rose-800 ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 md:hidden">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? "bg-rose-400 text-rose-100" : "text-rose-500"
                    } rounded-t-3xl  w-full px-2 py-1 text-sm font-bold `}
                  >
                    <Link passHref href={"/registry"}>
                      <a>
                        <span className="text-2xl flex items-center justify-center">
                          📋 <span className="text-sm ml-2">Registry</span>
                        </span>
                      </a>
                    </Link>
                  </button>
                )}
              </Menu.Item>
            </div>
            <div className="px-1 py-1 md:hidden">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? "bg-rose-400 text-rose-100" : "text-rose-500"
                    }  w-full px-2 py-1 text-sm font-bold `}
                  >
                    <Link passHref href={"/propose"}>
                      <a>
                        <span className="text-2xl flex items-center justify-center">
                          ❤️ <span className="text-sm ml-2">Love</span>
                        </span>
                      </a>
                    </Link>
                  </button>
                )}
              </Menu.Item>
            </div>
            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? "bg-rose-400 text-rose-100" : "text-rose-500"
                    } md:rounded-t-3xl  w-full px-2 py-2 text-sm font-bold`}
                    onClick={() => router.push("/help")}
                  >
                    Help - FAQ
                  </button>
                )}
              </Menu.Item>
            </div>
            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? "bg-rose-400 text-rose-100" : "text-rose-500"
                    } rounded-b-3xl  w-full px-2 py-2 text-sm font-bold`}
                    onClick={() => disconnect()}
                  >
                    Disconnect
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
