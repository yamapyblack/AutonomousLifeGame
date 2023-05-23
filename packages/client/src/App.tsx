import { useComponentValue } from "@latticexyz/react";
import { useMUD } from "./MUDContext";
import { GameBoard } from "./GameBoard";
import { SyncState } from "@latticexyz/network";

export const App = () => {
  const {
    components: { Counter, LoadingState },
    systemCalls: { increment },
    network: { singletonEntity },
  } = useMUD();

  const counter = useComponentValue(Counter, singletonEntity);
  const loadingState = useComponentValue(LoadingState, singletonEntity, {
    state: SyncState.CONNECTING,
    msg: "Connecting",
    percentage: 0,
  });

  return (
    <div className="wrapper">
      <header className="z-50 text-center">
        <h1 className="font-dot text-5xl p-4">Autonomous Game Of Life</h1>
      </header>
      {/* <div className=" bg-red-500 text-sky-600">
        Counter: <span>{counter?.value ?? "??"}</span>
      </div>
      <button
        type="button"
        onClick={async (event) => {
          event.preventDefault();
          console.log("new counter value:", await increment());
        }}
      >
        Increment
      </button> */}
      {loadingState.state !== SyncState.LIVE ? (
        <div>
          {loadingState.msg} ({Math.floor(loadingState.percentage)}%)
        </div>
      ) : (
        <GameBoard />
      )}

      {/* <footer className="z-50 text-center py-2 text-sm">
        &copy; Komorebi88, yamapyblack, yujiym
      </footer> */}
    </div>
  );
};
