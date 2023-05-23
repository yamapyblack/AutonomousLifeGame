import { Entity, getComponentValue } from "@latticexyz/recs";
import { awaitStreamValue } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";
import { world } from "./world";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { worldSend, txReduced$, singletonEntity }: SetupNetworkResult,
  { Counter, Players, MaxPlayerId }: ClientComponents
) {
  const increment = async () => {
    const tx = await worldSend("increment", []);
    return getComponentValue(Counter, singletonEntity);
  };
  const add = async (x: number, y: number, id: number) => {
    const tx = await worldSend("add", [x, y, id]);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    // return getComponentValue(Counter, singletonEntity);
  };
  const join = async () => {
    const tx = await worldSend("join", []);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(MaxPlayerId, singletonEntity);
  };
  const calculate = async () => {
    const tx = await worldSend("calculate", []);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
  };
  const getCellPower = async (id: number) => {
    const cellPower = getComponentValue(Players, encodeNumber(id) as Entity);
    console.log("cellPower", cellPower);
    return cellPower;
  };
  const clear = async () => {
    await worldSend("clear", []);
  };
  // const getCellPower = async (id: number) => {
  //   const tx = await worldSend("getCellPower", [id]);
  //   return await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
  // };

  const encodeNumber = (num: number): string => {
    const hexString = (num >= 0 ? num : 0xffffffff + num + 1)
      .toString(16)
      .padStart(8, "0");
    return hexString;
  };

  return {
    add,
    join,
    calculate,
    increment,
    getCellPower,
    clear,
  };
}
