import { useEffect, useState } from "react";
import { useComponentValue, useRow } from "@latticexyz/react";
import { useMUD } from "./MUDContext";
import { hexToArray } from "@latticexyz/utils";
import { world } from "./mud/world";

export const GameBoard = () => {
  const [userId, setUserId] = useState("");
  const [cellPower, setCellPower] = useState(13);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleLogin = (e: any) => {
    e.preventDefault();
    const inputUserId = e.target.elements.userId.value;
    setUserId(inputUserId);
    console.log(inputUserId);
  };

  const {
    components: { MapConfig, Players },
    network: { singletonEntity },
    systemCalls: { add, join, calculate, getCellPower, clear },
  } = useMUD();

  // useEffect(() => {
  //   //if userId is set, set cellPower
  //   if (userId) {
  //     getCellPower(Number(userId)).then((power) => {
  //       console.log("power", power);
  //       setCellPower(power!);
  //     });
  //   }
  // }, [userId]);

  useEffect(() => {
    let calculateInterval: any;

    if (isCalculating) {
      calculateInterval = setInterval(async () => {
        await calculate();
      }, 1500);
    }

    return () => {
      if (calculateInterval) {
        clearInterval(calculateInterval);
      }
    };
  }, [isCalculating]); // isCalculating is a dependency now

  //map
  const mapConfig = useComponentValue(MapConfig, singletonEntity);
  if (mapConfig == null) {
    throw new Error(
      "map config not set or not ready, only use this hook after loading state === LIVE"
    );
  }

  const { width, height, cell: cellData } = mapConfig;
  const cellValues = Array.from(hexToArray(cellData)).map((value, index) => {
    return {
      x: index % width,
      y: Math.floor(index / width),
      value,
    };
  });
  const rows = new Array(height).fill(0).map((_, i) => i);
  const columns = new Array(width).fill(0).map((_, i) => i);

  // //stamina
  // const stamina = useComponentValue(
  //   Players,
  //   world.registerEntity({ id: userId })
  // )?.cellPower;

  return (
    <>
      {userId ? (
        <>
          <div className="flex justify-center">
            <div className="mr-4">Player Id: {userId}</div>
            <div className="">Stamina: {cellPower}</div>
          </div>
          <div className="flex justify-center">
            <div
              className="inline-grid overflow-hidden"
              style={{ width: "780px" }}
            >
              {rows.map((y) =>
                columns.map((x) => {
                  const cell = cellValues.find(
                    (t) => t.x === x && t.y === y
                  )?.value;

                  return (
                    <div
                      key={`${x},${y}`}
                      style={{
                        gridColumn: x + 1,
                        gridRow: y + 1,
                      }}
                      onClick={async (event) => {
                        if (cellPower > 0) {
                          setCellPower(cellPower - 1);
                        }
                        event.preventDefault();
                        await add(x, y, Number(userId));
                      }}
                    >
                      {cell == 0 ? (
                        <div className="relative h-4 bg-white border-black border-2"></div>
                      ) : cell == 1 ? (
                        <div className="relative h-4 bg-blue-700 border-black border-2"></div>
                      ) : cell == 2 ? (
                        <div className="relative h-4 bg-green-700 border-black border-2"></div>
                      ) : cell == 3 ? (
                        <div className="relative h-4 bg-yellow-700 border-black border-2"></div>
                      ) : cell == 4 ? (
                        <div className="relative h-4 bg-red-700 border-black border-2"></div>
                      ) : cell == 5 ? (
                        <div className="relative h-4 bg-purple-700 border-black border-2"></div>
                      ) : cell == 6 ? (
                        <div className="relative h-4 bg-pink-700 border-black border-2"></div>
                      ) : cell == 7 ? (
                        <div className="relative h-4 bg-light-blue-700 border-black border-2"></div>
                      ) : cell == 8 ? (
                        <div className="relative h-4 bg-dark-700 border-black border-2"></div>
                      ) : (
                        <div className="relative h-4 bg-black border-black border-2"></div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              onClick={async (event) => {
                event.preventDefault();
                setIsCalculating(!isCalculating);
              }}
            >
              {isCalculating ? "Stop" : "Start"}
            </button>
          </div>
          <div className="flex justify-center mt-4">
            <button
              type="button"
              className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              onClick={async (event) => {
                event.preventDefault();
                await clear();
                setUserId("");
                setCellPower(13);
                setIsCalculating(false);
              }}
            >
              {"Reset"}
            </button>
          </div>
        </>
      ) : (
        <div className="flex justify-center">
          <div className=" p-6 m-6  border-gray-200 rounded-lg border-2  dark:border-gray-600">
            <div className="flex items-center justify-center p-4">
              <button
                data-modal-hide="staticModal"
                type="button"
                className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                onClick={async (event) => {
                  event.preventDefault();
                  const joinedId = (await join())!.value;
                  setUserId(joinedId.toString());
                  console.log("join", joinedId);
                }}
              >
                Signup
              </button>
            </div>
            <form onSubmit={handleLogin}>
              <div className="flex items-center justify-center mt-6">
                <label htmlFor="userId" className="sr-only">
                  Player ID
                </label>
                <input
                  id="userId"
                  type="text"
                  required
                  className="w-2/3 px-3 py-2 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none"
                  placeholder="Player ID"
                  // onChange={(e) => setUserId(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-center p-4">
                <button
                  data-modal-hide="staticModal"
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
