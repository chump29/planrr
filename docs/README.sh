#!/usr/bin/env -S bash -e

export _frontend=planrr-frontend:80
export _frontendPort=http://localhost:91
export _port=5557
export _backend=planrr-backend:$_port
export _backendPort=http://localhost:$_port
export _user=chump29
export _repo=planrr

echo -e "\n🛠️  Creating README files..."

mkdir dist

for md in README README-frontend README-backend; do
  envsubst < $md.template.md > dist/$md.md
done

echo -e "⿻ Moving README files...\n"

cd dist || exit 1

mv README.md ../..
mv README-frontend.md ../../frontend/README.md
mv README-backend.md ../../backend/README.md

cd .. || exit 1

rm -rf dist
