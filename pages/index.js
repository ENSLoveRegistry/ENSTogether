import Link from "next/link";
import React, { useContext, useState } from "react";
import { UserContext } from "../context/userContext";
import { UnitedContext } from "../context/registryContext";
import Confetti from "react-confetti";
import useWindowSize from "../hooks/window";

import { useConnect } from "wagmi";
import { XIcon } from "@heroicons/react/solid";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [open, setOpen] = useState(true);
  const { proposalsCounter, registryCounter } = useContext(UnitedContext);
  const { accountData, hearts, setHearts } = useContext(UserContext);
  const [
    {
      data: { connectors },
      error,
    },
    connect,
  ] = useConnect();
  const mm = connectors[0];

  const size = useWindowSize();

  return (
    <>
      {size.height > 0 && size.width > 0 && hearts && (
        <Confetti
          width={size.width}
          height={size.height}
          colors={["#F43E5E", "#FECDD3"]}
          recycle={false}
          opacity={0.8}
          tweenDuration={8000}
          numberOfPieces={50}
          confettiSource={{
            x: 0,
            y: 0,
            w: size.width,
            h: size.height,
          }}
          friction={0.99}
          gravity={-0.5}
          onConfettiComplete={() => setHearts(false)}
          drawShape={(ctx) => {
            ctx.beginPath();
            ctx.moveTo(75, 40);
            ctx.bezierCurveTo(75, 37, 70, 25, 50, 25);
            ctx.bezierCurveTo(20, 25, 20, 62.5, 20, 62.5);
            ctx.bezierCurveTo(20, 80, 40, 102, 75, 120);
            ctx.bezierCurveTo(110, 102, 130, 80, 130, 62.5);
            ctx.bezierCurveTo(130, 62.5, 130, 25, 100, 25);
            ctx.bezierCurveTo(85, 25, 75, 37, 75, 40);
            ctx.fill();
          }}
        />
      )}

      <div className="flex flex-col justify-center items-center w-full min-h-screen py-4 px-12 text-rose-500">
        <h1 className="text-4xl sm:text-6xl font-bold text-center">
          A love registry on the <br /> Ethereum blockchain
        </h1>
        <h2 className="mt-6 font-light text-xl sm:text-3xl text-center">
          Create a love proposal and share it with your partner <br />
          Wait for confirmation and enter this registry
        </h2>
        <h3 className="mt-6 font-medium text-rose-400 text-sm text-center py-2 px-8 border border-rose-200 rounded-3xl">
          To be able to register you must have an active ENS name.
          <Link passHref href={"/faq"}>
            <a>
              <span className="ml-2 text-rose-500 text-xs font-bold tracking-tighter hover:text-rose-600 ">
                &rarr; LEARN WHY
              </span>
            </a>
          </Link>
        </h3>

        {!accountData && (
          <button
            className=" my-8 py-2 px-6 bg-rose-600 text-rose-50 rounded-full hover:opacity-60 text-bold text-xl"
            onClick={() => connect(mm)}
          >
            Connect Wallet
          </button>
        )}
        {open ? (
          <div className="fixed z-10 bottom-4 flex items-center rounded-md  bg-rose-200 border border-rose-300 text-rose-600  py-2 px-8">
            <p>Currently working only on Goerli Network</p>
            <button onClick={() => setOpen(!open)} className="relative">
              <XIcon className="text-rose-600 h-3 w-3 absolute z-20 bottom-0 left-3" />
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
}
