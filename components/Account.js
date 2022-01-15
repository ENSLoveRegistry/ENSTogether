import Image from "next/image";
import { useAccount } from "wagmi";
import { useNetwork } from "wagmi";
import { formatAddress } from "../utils/address";

export const Account = () => {
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  });
  const [{ data: networkData }] = useNetwork();

  if (!accountData) return <div>No account connected</div>;

  return (
    <>
      <h1>United</h1>
      <div className="flex">
        <span className="mr-2">{networkData && networkData.chain.name}</span>
        {accountData?.ens?.avatar && (
          <Image
            src={accountData.ens.avatar}
            alt="ENS profile picture avatar"
            width={40}
            height={40}
            objectFit="cover"
          />
        )}
        {accountData?.ens?.name && accountData?.ens?.name}
        {accountData?.address
          ? ` (${formatAddress(accountData?.address)})`
          : null}
      </div>
      <div>
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    </>
  );
};
