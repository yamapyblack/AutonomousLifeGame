// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import {System} from "@latticexyz/world/src/System.sol";
import {MaxPlayerId, Players} from "../codegen/Tables.sol";

contract JoinSystem is System {
  uint8 public constant INIT_CELL_POWER = 12;

  function join() public returns (uint8 playerId_) {
    uint8 maxPlayerId = MaxPlayerId.get();
    uint8 nextPlayerId = maxPlayerId + 1;
    MaxPlayerId.set(nextPlayerId);
    Players.set(nextPlayerId, address(0), INIT_CELL_POWER);
  }

  function getCellPower(uint8 playerId_) public view returns (uint8 cellPower_) {
    cellPower_ = Players.get(playerId_).cellPower;
  }
}
