import Link from "next/link";
import { FaTwitter, FaGithub } from "react-icons/fa";

export default function Nav() {
  return (
    <div className="fixed z-50 top-0 w-full flex px-4 md:px-6 lg:px-12  py-4 md:py-6 justify-between items-center mx-auto  ">
      <Link passHref href={"/"}>
        <a>
          <h3 className="text-xl sm:text-2xl text-rose-500 font-bold">
            ENSTogether
          </h3>
        </a>
      </Link>
      <Link passHref href={"https://twitter.com/EnsTogether"}>
        <a target="_blank" rel="noopener noreferrer">
          <FaTwitter className="text-rose-600 h-4 w-4 md:h-6 md:w-6 mr-4 md:mr-6 hover:text-rose-700" />
        </a>
      </Link>
    </div>
  );
}
