// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import "forge-std/Test.sol";
import {MudV2Test} from "@latticexyz/std-contracts/src/test/MudV2Test.t.sol";

import {IWorld} from "../src/codegen/world/IWorld.sol";
import {MapConfig, Players, MaxPlayerId, CalculatedCount} from "../src/codegen/Tables.sol";

contract ClearTest is MudV2Test {
  IWorld public world;

  function setUp() public override {
    super.setUp();
    world = IWorld(worldAddress);
  }

  function test_clear() public {
    world.join();
    world.add(0, 9, 1);

    //clear
    world.clear();

    (uint32 width, uint32 height, bytes memory cell) = MapConfig.get(world);
    assertEq(cell, new bytes(0));

    assertEq(Players.get(world, 1).cellPower, 0);
    assertEq(Players.get(world, 1).user, address(0));

    uint8 maxPlayerId = MaxPlayerId.get(world);
    assertEq(maxPlayerId, 0);

    assertEq(CalculatedCount.get(world), 0);
  }
}
