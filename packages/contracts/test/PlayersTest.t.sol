// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import "forge-std/Test.sol";
import {MudV2Test} from "@latticexyz/std-contracts/src/test/MudV2Test.t.sol";

import {IWorld} from "../src/codegen/world/IWorld.sol";
import {Players, MaxPlayerId} from "../src/codegen/Tables.sol";

contract PlayersTest is MudV2Test {
  IWorld public world;

  function setUp() public override {
    super.setUp();
    world = IWorld(worldAddress);
  }

  function test_join() public {
    // Expect the counter to be 1 because it was incremented in the PostDeploy script.
    uint8 maxPlayerId = MaxPlayerId.get(world);
    assertEq(maxPlayerId, 0);

    // Expect the counter to be 2 after calling increment.
    world.join();
    maxPlayerId = MaxPlayerId.get(world);
    assertEq(maxPlayerId, 1);

    // assertEq(Players.get(world, 1).user, address(0));
    assertEq(Players.get(world, 1).cellPower, 12);
  }
}
