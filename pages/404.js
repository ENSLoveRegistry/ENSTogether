import Link from "next/link";
export default function Custom404() {
  return (
    <>
      <div className="flex flex-col  justify-center items-center min-h-screen text-rose-600">
        <h1 className="text-4xl tracking-tight font-medium ">NOT FOUND</h1>
        <Link passHref href={"/"}>
          <a>
            <button className="mt-4 py-1 px-4 bg-rose-200 hover:bg-rose-300 hover:text-rose-700 rounded-full">
              Take me home
            </button>
          </a>
        </Link>
      </div>
    </>
  );
}
