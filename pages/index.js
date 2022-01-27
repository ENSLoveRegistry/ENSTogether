import Link from "next/link";
import React, { useContext } from "react";
import { UserContext } from "../context/userContext";
import Confetti from "react-confetti";
import useWindowSize from "../hooks/window";

import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const { hearts, setHearts } = useContext(UserContext);

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

      <div className=" mt-0  md:mt-10 lg:mt-0 flex flex-col justify-center items-center w-full min-h-screen py-4 px-12 text-rose-500">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center max-w-2xl">
          A love registry on the Ethereum blockchain
        </h1>
        <h2 className="mt-4 lg:mt-6 font-light text-lg md:text-2xl lg:text-3xl text-center">
          Create a love proposal and share it with your partner <br />
          Wait for confirmation and enter this registry
        </h2>
        <h3 className="mt-4  lg:mt-6 font-medium text-rose-400 text-sm text-center py-2 px-8 border border-rose-200 rounded-3xl">
          To be able to register you must have an active ENS name.
          <Link passHref href={"/help"}>
            <a>
              <span className="ml-2 text-rose-500 text-xs font-bold tracking-tighter hover:text-rose-600 ">
                &rarr; LEARN WHY
              </span>
            </a>
          </Link>
        </h3>

        <div className=" mt-6 lg:mt-8 py-2 px-6 bg-rose-600 text-rose-50 rounded-full  text-bold text-dm md:text-md lg:text-lg">
          Coming Soon!
        </div>
      </div>
    </>
  );
}
