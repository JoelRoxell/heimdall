#!/bin/bash

echo "removing old keys...";

rm -rf ./.ssh
mkdir ./.ssh

openssl genrsa -out .ssh/secret.pem 4096
openssl rsa -in .ssh/secret.pem -pubout > .ssh/secret.pub

echo "done"
