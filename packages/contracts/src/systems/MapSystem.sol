// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import {System} from "@latticexyz/world/src/System.sol";
import {MapConfig, CalculatedCount, Players, MaxPlayerId} from "../codegen/Tables.sol";

contract MapSystem is System {
  uint8 constant CELL_POWER_INTERVAL = 8;
  uint8 constant INIT_CELL_POWER = 12;

  function calculate() public {
    //caluculate next map
    (uint32 width, uint32 height, bytes memory cell) = MapConfig.get();
    bytes memory newCell = _calculate(width, height, cell);
    MapConfig.setCell(newCell);

    //increase cell power
    uint256 _nextCount = CalculatedCount.get() + 1;
    CalculatedCount.set(_nextCount);
    if (_nextCount % CELL_POWER_INTERVAL == 0) {
      uint8 _maxPlayerId = MaxPlayerId.get();
      for (uint8 i = 1; i <= _maxPlayerId; i++) {
        uint8 _cellPower = Players.get(i).cellPower;
        if (_cellPower < INIT_CELL_POWER) {
          Players.setCellPower(i, _cellPower + 1);
        }
      }
    }
  }

  function _calculate(uint32 width, uint32 height, bytes memory cell) internal view returns (bytes memory newCell) {
    newCell = new bytes(width * height);

    for (uint32 y = 0; y < height; y++) {
      for (uint32 x = 0; x < width; x++) {
        // count neighbours
        uint8 numLiveNeighbours = 0;
        uint8[] memory neighbourIds = new uint8[](3);
        for (int32 j = -1; j <= 1; j++) {
          int32 yy = int32(y) + j;
          if (yy >= int32(height) || yy < 0) continue; //out of map
          for (int32 i = -1; i <= 1; i++) {
            if (i == 0 && j == 0) continue; //center cell is self
            int32 xx = int32(x) + i;
            if (xx >= int32(width) || xx < 0) continue; //out of map
            uint8 neighbourId = uint8(cell[(uint32(yy) * width) + uint32(xx)]);
            if (neighbourId == 0) continue;
            //memory ids to judge dominant player ids when bornning
            //born is max 3 neighbours, so 3 is enough
            if (numLiveNeighbours < 3) {
              neighbourIds[numLiveNeighbours] = neighbourId;
            }
            numLiveNeighbours++;
          }
        }

        uint8 cellValue = uint8(cell[(uint32(y) * width) + uint32(x)]);
        if (cellValue == 0) {
          //born
          if (numLiveNeighbours == 3) {
            //born with dominant player id
            uint8 dominantId;
            if (neighbourIds[0] == neighbourIds[1] || neighbourIds[0] == neighbourIds[2]) {
              dominantId = neighbourIds[0];
            } else if (neighbourIds[1] == neighbourIds[2]) {
              dominantId = neighbourIds[1];
            } else {
              dominantId = neighbourIds[0];
            }
            newCell[(y * width) + x] = bytes1(dominantId);
          }
        } else {
          //live
          if (numLiveNeighbours == 2 || numLiveNeighbours == 3) {
            newCell[(y * width) + x] = bytes1(uint8(cellValue));
          }
        }
      }
    }
  }
}
