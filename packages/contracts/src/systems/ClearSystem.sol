// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import {System} from "@latticexyz/world/src/System.sol";
import {MapConfig, CalculatedCount, Players, MaxPlayerId} from "../codegen/Tables.sol";

contract ClearSystem is System {
  function clear() public {
    //clear map config
    uint32 height = 45;
    uint32 width = 60;
    MapConfig.setCell(new bytes(width * height));
    //clear players
    uint8 _maxPlayerId = MaxPlayerId.get();
    for (uint8 i = 1; i <= _maxPlayerId; i++) {
      Players.deleteRecord(i);
    }
    //clear max player id
    MaxPlayerId.set(0);
    //clear calculated count
    CalculatedCount.set(0);
  }
}
