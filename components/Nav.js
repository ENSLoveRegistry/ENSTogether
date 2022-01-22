import Link from "next/link";

export default function Nav() {
  return (
    <div className="fixed z-50 top-0 w-full flex px-4 md:px-6 lg:px-12  py-4 md:py-6 justify-between items-center mx-auto backdrop-blur-sm  ">
      <Link passHref href={"/"}>
        <a>
          <h3 className="text-xl sm:text-2xl text-rose-500 font-bold">
            ENSTogether
          </h3>
        </a>
      </Link>
      <span className="text-2xl">❤️</span>
    </div>
  );
}
