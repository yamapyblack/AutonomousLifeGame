import { MUDChain, latticeTestnet } from "@latticexyz/common/chains";
import { foundry, optimismGoerli } from "@wagmi/chains";

// If you are deploying to chains other than anvil or Lattice testnet, add them here
export const supportedChains: MUDChain[] = [
  foundry,
  latticeTestnet,
  optimismGoerli,
];
