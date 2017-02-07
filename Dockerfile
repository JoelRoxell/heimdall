FROM node:7.2.0
MAINTAINER Joel Roxell <joel.roxell@na-kd.com>

WORKDIR /home/node/app

COPY scripts ./scripts
COPY src ./src
COPY package.json .
COPY .nycrc .

# Install yarn to install and remove dependencies faster
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
  echo "deb http://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
  apt-get update && apt-get install yarn

# Install dev-dependencies to be able to run tests
RUN yarn

RUN ./scripts/generate-keys.sh
COPY .ssh .ssh

RUN mkdir log

# Remove dev dependencies after successful test
# This is equivalent to 'npm prune --production'
# RUN yarn install --production --ignore-scripts --prefer-offline

ENTRYPOINT [ "bash", "./scripts/entrypoint.sh" ]
