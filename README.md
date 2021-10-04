# SignalR Proof of Concept - Client

This project shows how to integrate microsoft's SignalR api with Redux Toolkit. This project works in tandem with this connection hub: https://github.com/jorgecamilowu/signalr-hub-poc

## How to bootstrap a connection?

The middleware receives a connection hub and a config object with the server methods.
The middleware will then register each method passed inside the config.

## How to access the connection hub?

The connection hub is injected into redux actions so that communication logic can be abstracted away from components.

## Set Up

1. `yarn install`
2. `yarn start`
