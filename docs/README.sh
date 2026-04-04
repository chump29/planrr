#!/usr/bin/env -S bash -e

export _frontend=planrr-frontend:80
export _frontendPort=http://localhost:91
export _port=5557
export _backend=planrr-backend:$_port
export _backendPort=http://localhost:$_port
export _user=chump29
export _repo=planrr

clear

mkdir dist

for md in README README-frontend README-backend; do
  echo "🛠️  Creating ${md/-/ } file"
  envsubst < $md.template.md > dist/$md.md
done

cd dist || exit 1

echo "⿻ Moving README files"

mv README.md ../..
mv README-frontend.md ../../frontend/README.md
mv README-backend.md ../../backend/README.md

cd .. || exit 1

rm -rf dist
