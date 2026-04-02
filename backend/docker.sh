#!/usr/bin/env -S bash -e

_yellow="\e[4;93m"
_nc="\e[0m"
_build=📦
_start="▶️ "

echo -e "${_build} ${_yellow}Building${_nc}:\n"
./Dockerfile

echo -e "\n${_start} ${_yellow}Starting${_nc}:\n"
docker container rm --force planrr-backend > /dev/null 2>&1
docker container run --rm --name planrr-backend --publish 5557:5557 --env TZ=America/Chicago --detach --network=planrr_default planrr-backend

