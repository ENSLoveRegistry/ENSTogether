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
  return (
    <div>
      <div>
        <button
          disabled={!mm.ready}
          className=" px-4 py-2 text-sm font-medium text-white bg-black rounded-full bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
          onClick={() => connect(mm)}
        >
          CONNECT
          {/* {!mm.ready && ""} */}
          {mm.name === connector?.name && ""}
        </button>
      </div>
      <div>{error && (error?.message ?? "Failed to connect")}</div>
    </div>
  );
};
