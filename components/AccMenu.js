import { useNetwork } from "wagmi";
import { useAccount } from "wagmi";
import Image from "next/image";
import { useRouter } from "next/router";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { formatAddress } from "../utils/address";

export default function AccMenu() {
  const router = useRouter();
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  });
  const [{ data: networkData }] = useNetwork();

  return (
    <div className="w-56 text-right ">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className=" px-4 py-2 text-sm font-medium text-white bg-black rounded-full bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            <div className="flex items-center ">
              {/* <span className="mr-2">
                {networkData && networkData.chain.name}
              </span> */}

              {/* AVATAR */}
              {accountData?.ens?.avatar ? (
                <Image
                  src={accountData.ens.avatar}
                  alt="ENS profile picture avatar"
                  width={40}
                  height={40}
                  objectFit="cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-orange-200"></div>
              )}

              <div className="flex flex-col justify-start px-2">
                {accountData?.ens?.name && (
                  <h5 className="font-bold text-md">
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
          <Menu.Items className="absolute right-0 w-40 mt-2 origin-top-right bg-rose-100 rounded-3xl shadow-lg shadow-rose-300/50 ring-1 ring-rose-800 ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? "bg-rose-400 text-rose-100" : "text-rose-500"
                    } rounded-t-3xl  w-full px-2 py-2 text-sm font-bold`}
                    onClick={() => router.push("/faq")}
                  >
                    FAQ
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
                    } rounded-b-3xl  w-full px-4 py-2 text-sm font-bold`}
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
