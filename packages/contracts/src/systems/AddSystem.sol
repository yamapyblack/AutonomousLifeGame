// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import {System} from "@latticexyz/world/src/System.sol";
import {MapConfig, Players} from "../codegen/Tables.sol";

contract AddSystem is System {
  // add this method
  function add(uint32 _x, uint32 _y, uint8 _id) public {
    //reduce cell power
    uint8 _cellPower = Players.get(_id).cellPower;
    if (_cellPower == 0) revert("Cell power is 0");
    Players.setCellPower(_id, _cellPower - 1);

    // map
    (uint32 width, uint32 height, bytes memory cell) = MapConfig.get();

    for (uint32 y = 0; y < height; y++) {
      for (uint32 x = 0; x < width; x++) {
        uint8 cellValue = uint8(cell[(y * width) + x]);
        if (x == _x && y == _y) {
          if (cellValue != 0) revert("Cell is already occupied");
          cell[(y * width) + x] = bytes1(_id);
          //break;
          x = width;
          y = height;
        } else {
          if (cellValue == 0) continue;
        }
      }
    }

    MapConfig.setCell(cell);
  }
}
