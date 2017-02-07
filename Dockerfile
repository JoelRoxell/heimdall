FROM node:7.2.0
MAINTAINER Joel Roxell <joel.roxell@na-kd.com>

# Install yarn to install and remove dependencies faster
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
  echo "deb http://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
  apt-get update && apt-get install yarn

WORKDIR /tmp

ADD package.json /tmp/package.json

# Install dev-dependencies to be able to run tests
RUN yarn

RUN mkdir -p /home/node/app && cp -a /tmp/node_modules /home/node/app/node_modules
WORKDIR /home/node/app

ADD scripts ./scripts
ADD src ./src
ADD .nycrc .

RUN ./scripts/generate-keys.sh

# Remove dev dependencies after successful test
# This is equivalent to 'npm prune --production'
# RUN yarn install --production --ignore-scripts --prefer-offline

ENTRYPOINT [ "bash", "./scripts/entrypoint.sh" ]
