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
  const [rows, setRows] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const [columns, setColumns] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

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

  //map
  const mapConfig = useComponentValue(MapConfig, singletonEntity);

  useEffect(() => {
    if (mapConfig) {
      const { width, height, cell: cellData } = mapConfig;
      const rows = new Array(height).fill(0).map((_, i) => i);
      const columns = new Array(width).fill(0).map((_, i) => i);
      setRows(rows);
      setColumns(columns);
    }
  }, [mapConfig]);

  // const { width, height, cell: cellData } = mapConfig;
  // const cellValues = Array.from(hexToArray(cellData)).map((value, index) => {
  //   return {
  //     x: index % width,
  //     y: Math.floor(index / width),
  //     value,
  //   };
  // });
  // const rows = new Array(height).fill(0).map((_, i) => i);
  // const columns = new Array(width).fill(0).map((_, i) => i);
  // const activeCells: number = cellValues.filter((obj) => obj.value != 0).length;

  // //stamina
  // const stamina = useComponentValue(
  //   Players,
  //   world.registerEntity({ id: userId })
  // )?.cellPower;

  //CalculatedCount
  // const calculatedCount = useComponentValue(CalculatedCount, singletonEntity);

  return (
    <>
      <div className="flex justify-center pt-2 pb-4 font-dot text-xl">
        <div className="mr-8">
          {/* Cycle: {BigInt(calculatedCount?.value ?? 0).toLocaleString()} */}
        </div>
        {/* <div className="">Cells: {BigInt(activeCells).toLocaleString()}</div> */}
      </div>
      <>
        <div className="flex justify-center">
          <div className="grid gap-1">
            {rows.map((y) =>
              columns.map((x) => {
                return (
                  <div
                    key={`${x},${y}`}
                    style={{
                      gridColumn: x + 1,
                      gridRow: y + 1,
                    }}
                  >
                    <div className={`h-2.5 w-2.5 ${getCellColor(0)}`} />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </>
    </>
  );
};
