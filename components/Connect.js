import { useConnect } from "wagmi";

export const Connect = () => {
  const [
    {
      data: { connector, connectors },
      error,
      loading,
    },
    connect,
  ] = useConnect();
  const mm = connectors[0];
  console.log(mm);
  console.log(error);
  return (
    <div>
      <div className="flex items-center">
        <p className="text-sm text-rose-800 mr-4">
          {error && "Processing eth_requestAccounts. Failed to connect"}
        </p>
        <button
          // disabled={!mm.ready}
          className=" px-4 py-2 text-sm font-medium text-rose-600 border border-rose-600  rounded-full bg-opacity-20 hover:bg-rose-400 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
          onClick={() => connect(mm)}
        >
          CONNECT
        </button>
      </div>
    </div>
  );
};
