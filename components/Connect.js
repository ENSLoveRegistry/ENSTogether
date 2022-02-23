import { useConnect } from "wagmi";

export const Connect = () => {
  const [
    {
      data: { connectors },
    },
    connect,
  ] = useConnect();
  const mm = connectors[0];
  return (
    <div>
      <div className="flex items-center">
        <button
          className=" px-4 py-2 text-sm font-medium text-rose-600 border border-rose-600  rounded-full bg-opacity-20 hover:bg-rose-400 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
          onClick={() => connect(mm)}
        >
          CONNECT
        </button>
      </div>
    </div>
  );
};
