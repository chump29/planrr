#!/usr/bin/env -S bash -e

export _frontend=planrr-frontend:80
export _frontendPort=http://localhost:91
export _port=5557
export _backend=planrr-backend:$_port
export _backendPort=http://localhost:$_port
export _user=chump29
export _repo=planrr

clear

if [ -d dist ]; then
  rm -f dist/*
else
  mkdir dist
fi

for md in README README-frontend README-backend; do

: <<'TODO'
  if [ $md == README ]; then
    for dep in $(yq ".project.dependencies[]" ../backend/pyproject.toml); do
      for d in fastapi pydantic; do
        if [[ "$dep" == "$d"* ]]; then
          echo "$dep" | awk -F">=" '{print $2}'
        fi

      done
    done
  fi
TODO

  echo "🛠️  Creating ${md/-/ } file"
  _file=dist/$md.md
  envsubst < $md.template.md > $_file
  if [ $md == "README-backend" ]; then
    sed -i "/MD060/d" $_file
  fi
done

pushd dist > /dev/null || exit 1

echo "⿻ Moving README files"

mv README.md ../..
mv README-frontend.md ../../frontend/README.md
mv README-backend.md ../../backend/README.md

popd > /dev/null || exit 1

rm -rf dist
