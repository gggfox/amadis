#!/bin/bash

redis-server &
yarn --cwd ./server/ watch &
yarn --cwd ./server/ dev &
yarn --cwd ./client/ dev