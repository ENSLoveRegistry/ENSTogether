export const NetworkSwitcher = ({
  networkData,
  switchNetwork,
  switchNetworkError,
}) => {
  return (
    <div>
      {/* <div>
        Connected to {networkData.chain?.name ?? networkData.chain?.id}
        {networkData.chain?.unsupported && "(unsupported)"}
      </div> */}

      <div className="flex items-center">
        <span className="text-red-700 mr-4 font-bold">Wrong Network!</span>
        <button
          className="mr-4 px-4 py-2 text-sm font-medium text-white bg-black rounded-full bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
          onClick={() => switchNetwork(networkData.chains[3].id)}
        >
          Switch to Goerli
        </button>
      </div>

      {switchNetworkError && switchNetworkError?.message}
    </div>
  );
};
