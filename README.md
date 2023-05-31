# AutonomousGameofLife

AutonomousGameofLife is Multiplayer Onchain Game of Life + Onchain cellular automaton template for AWs

<img width="656" alt="image" src="https://github.com/yamapyblack/AutonomousLifeGame/assets/7692282/fd0aea82-dee4-4839-bae6-9306b0253db9">

## Description

Autonomous Game of Life brings multiplayer Game of Life on-chain using MUD v2 for the first time, allowing anyone to play forever. Also we open-sourced Onchain cellular automaton template for AWs.

Our project aims to create a fully decentralized and multiplayer version of Conway's Game of Life, leveraging the capabilities of blockchain technology. And sharing templates so that anyone can build other cellular automata models on chain easily. By combining the principles of cellular automaton with the transparent and immutable nature of blockchain, we aim to provide an interactive and collaborative gaming experience for players.

We believe onchain cellular automaton can serve as a base layer tool for simulating and modeling autonomous worlds.

Note: The Game of Life, is a cellular automaton devised by the British mathematician John Horton Conway in 1970 by wikipedia.

## How it's made

The product is built by MUD v2 on OP Goeri network.

Each storage are defined in mud.config like tables and MapConfig data is stored as bytes32 to optimize storage size.

The game also realizes autonomous and multiplayer game using MUD. However, to take each steps automatically, too many transactions are required. So, it is strongly recommended to make the game-specific chain.

## MUD

https://mud.dev/
