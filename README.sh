#!/usr/bin/env -S bash -e

export _frontend=planrr-frontend:80
export _frontendPort=http://localhost:91
export _port=5557
export _backend=planrr-backend:$_port
export _backendPort=http://localhost:$_port
export _user=chump29
export _repo=planrr

sub() {
  envsubst < README.template.md > README.md
}

echo -e "📄 Creating README files...\n"

sub

cd frontend || exit 1
sub

cd ../backend || exit 1
sub
