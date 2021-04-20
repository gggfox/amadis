#!/bin/bash

redis-server
npm watch --prefix /server
npm dev --prefix /server
npm dev --prefix /client
