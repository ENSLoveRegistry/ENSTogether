import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center w-full min-h-screen py-4 px-12 text-rose-500">
      <h1 className="text-5xl font-bold text-center">
        A love registry on the <br /> Ethereum blockchain
      </h1>

      <h2 className="mt-6 font-medium text-xl text-center">
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
      <Link href="/propose" passHref>
        <a>
          <button className=" my-8 py-2 px-6 bg-rose-600 text-rose-50 rounded-full hover:opacity-60 text-bold text-xl">
            Connect Wallet
          </button>
        </a>
      </Link>
    </div>
  );
}

// export async function getStaticProps() {
//   const response = await client.query(query).toPromise();
//   console.log("response", response.data.unions);
//   return {
//     props: {
//       unions: response.data.unions,
//     },
//     revalidate: 60,
//   };
// }
