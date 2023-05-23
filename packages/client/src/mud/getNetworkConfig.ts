import { SetupContractConfig, getBurnerWallet } from "@latticexyz/std-client";
import worldsJson from "contracts/worlds.json";
import { supportedChains } from "./supportedChains";

const worlds = worldsJson as Partial<
  Record<string, { address: string; blockNumber?: number }>
>;

type NetworkConfig = SetupContractConfig & {
  privateKey: string;
  faucetServiceUrl?: string;
  snapSync?: boolean;
};

export async function getNetworkConfig(): Promise<NetworkConfig> {
  const params = new URLSearchParams(window.location.search);

  // const chainId = Number(import.meta.env.CHAIN_ID);
  // const worldAddress = import.meta.env.WORLD_ADDRESS;
  // const initialBlockNumber = import.meta.env.INITIAL_BLOCK_NUMBER;

  // const chainId = Number(420);
  // const worldAddress = "0x12DF9BEA3f7Cc25e385A30a0F53C317Bdeaa5E42";
  // const initialBlockNumber = 9690067;

  const chainId = Number(
    params.get("chainId") || import.meta.env.VITE_CHAIN_ID || 31337
  );
  console.log("chainId:", chainId);
  const chainIndex = supportedChains.findIndex((c) => c.id === chainId);
  const chain = supportedChains[chainIndex];
  if (!chain) {
    throw new Error(`Chain ${chainId} not found`);
  }

  const world = worlds[chainId.toString()];
  const worldAddress = params.get("worldAddress") || world?.address;
  if (!worldAddress) {
    throw new Error(
      `No world address found for chain ${chainId}. Did you run \`mud deploy\`?`
    );
  }
  console.log("worldAddress:", worldAddress);
  const initialBlockNumber = params.has("initialBlockNumber")
    ? Number(params.get("initialBlockNumber"))
    : world?.blockNumber ?? -1; // -1 will attempt to find the block number from RPC

  console.log("initialBlockNumber:", initialBlockNumber);

  // const jsonRpcUrl =
  //   // params.get("rpc") ||
  //   import.meta.env.JSON_RPC_URL ||
  //   // chain.rpcUrls.default.http[0];
  //   console.log("jsonRpcUrl:", jsonRpcUrl);
  // const wsRpcUrl =
  //   params.get("wsRpc") ||
  //   chain.rpcUrls.default.webSocket?.[0] ||
  //   "wss://opt-goerli.g.alchemy.com/v2/aWFq-OVN3tnqGVRIStXbwf1ApF3xqWEg";
  // console.log("wsRpcUrl:", wsRpcUrl);

  // const jsonRpcUrl = "https://goerli.optimism.io";
  // const wsRpcUrl =
  //   "wss://opt-goerli.g.alchemy.com/v2/aWFq-OVN3tnqGVRIStXbwf1ApF3xqWEg";

  // const privateKey = import.meta.env.PRIVATE_KEY;
  // console.log("privateKey:", privateKey);

  return {
    clock: {
      period: 1000,
      initialTime: 0,
      syncInterval: 5000,
    },
    provider: {
      chainId,
      jsonRpcUrl: params.get("rpc") || chain?.rpcUrls.default.http[0],
      wsRpcUrl: params.get("wsRpc") || chain?.rpcUrls.default.webSocket?.[0],
      // jsonRpcUrl: ,
      // wsRpcUrl: ,
      // jsonRpcUrl: jsonRpcUrl,
      // wsRpcUrl: wsRpcUrl,
    },
    privateKey: import.meta.env.PRIVATE_KEY || getBurnerWallet().value,
    // privateKey: privateKey,
    chainId,
    modeUrl: params.get("mode") ?? chain?.modeUrl,
    faucetServiceUrl: params.get("faucet") ?? chain?.faucetUrl,
    worldAddress,
    initialBlockNumber,
    snapSync: params.get("snapSync") === "true",
    disableCache: params.get("cache") === "false",
  };
}
