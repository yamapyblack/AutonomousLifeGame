import { useEffect, useState } from "react";
import { useComponentValue, useRow } from "@latticexyz/react";
import { useMUD } from "./MUDContext";
import { hexToArray } from "@latticexyz/utils";
import { world } from "./mud/world";
import { Pause, Play, Power, PlayCircle } from "lucide-react";

function getCellColor(cell: number | undefined): string {
  const _cell = Number(cell);
  if (cell === undefined || _cell === 0) return "bg-white/10";

  const _quotient: number = _cell % 10;
  switch (_quotient) {
    case 0:
      return "bg-gray-600";
    case 1:
      return "bg-blue-600";
    case 2:
      return "bg-green-600";
    case 3:
      return "bg-yellow-600";
    case 4:
      return "bg-red-600";
    case 5:
      return "bg-purple-600";
    case 6:
      return "bg-pink-600";
    case 7:
      return "bg-sky-600";
    case 8:
      return "bg-amber-600";
    case 9:
      return "bg-teal-600";
    default:
      return "bg-gray-600";
  }
}

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
    components: { MapConfig, Players, CalculatedCount },
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
    const UID = localStorage.getItem("autonomousLifeGameUID");
    if (UID) {
      setUserId(UID);
    }
  }, [userId]);

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
  const activeCells: number = cellValues.filter((obj) => obj.value != 0).length;

  // //stamina
  // const stamina = useComponentValue(
  //   Players,
  //   world.registerEntity({ id: userId })
  // )?.cellPower;

  //CalculatedCount
  const calculatedCount = useComponentValue(CalculatedCount, singletonEntity);

  return (
    <>
      <div className="flex justify-center pt-2 pb-4 font-dot text-xl">
        <div className="mr-8">
          Cycle: {BigInt(calculatedCount?.value ?? 0).toLocaleString()}
        </div>
        <div className="">Cells: {BigInt(activeCells).toLocaleString()}</div>
      </div>
      {userId ? (
        <>
          <div className="flex justify-center">
            <div className="grid gap-1">
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
                      <div
                        className={`h-2.5 w-2.5 ${getCellColor(cell) ?? ""}`}
                      />
                    </div>
                  );
                })
              )}
            </div>
          </div>
          {userId && (
            <>
              <div className="flex justify-center py-4 font-dot items-center">
                <div className="mr-8">Player Id: {userId}</div>
                <div className="mr-12">Stamina: {cellPower}</div>
                <button
                  type="button"
                  className="text-white border-gray-200 hover:bg-gray-200/5 border-2 px-4 py-1.5 text-center mr-4 rounded-sm"
                  onClick={async (event) => {
                    event.preventDefault();
                    setIsCalculating(!isCalculating);
                  }}
                >
                  {isCalculating ? (
                    <div className="flex items-center">
                      <Pause size={18} className="mr-1" />
                      Stop
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Play size={18} className="mr-1" />
                      Start
                    </div>
                  )}
                </button>
                <button
                  type="button"
                  className="text-white border-gray-200 hover:bg-gray-200/5 border-2 px-4 py-1.5 text-center mr-4 rounded-sm"
                  onClick={async (event) => {
                    event.preventDefault();
                    await clear();
                    setUserId("");
                    setCellPower(13);
                    setIsCalculating(false);
                  }}
                >
                  <div className="flex items-center text-amber-600">
                    <Power size={18} className="mr-1" />
                    Reset
                  </div>
                </button>
              </div>
            </>
          )}
        </>
      ) : (
        <div className="flex justify-center">
          <button
            type="button"
            className="text-white border-gray-200 hover:bg-gray-200/5 border-4 px-8 py-3 text-center rounded-sm mt-32 text-2xl font-dot"
            onClick={async (event) => {
              event.preventDefault();
              const joinedId = (await join())!.value;
              setUserId(joinedId.toString());
              localStorage.setItem(
                "autonomousLifeGameUID",
                joinedId.toString()
              );
              console.log("join", joinedId);
            }}
          >
            <div className="flex items-center">
              <PlayCircle size={26} className="mr-4" />
              Start Playing
            </div>
          </button>
        </div>
      )}
    </>
  );
};
