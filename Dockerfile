FROM joelroxell/docker-consul:0.1.1

MAINTAINER Joel Roxell <joel.roxell@na-kd.com>

RUN apt-get install build-essential python -y
RUN curl -sL https://deb.nodesource.com/setup_7.x | bash -
RUN apt-get install nodejs

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

ADD package.json package.json
ADD scripts ./scripts
ADD src ./src
ADD .nycrc .
RUN mkdir -p ./log/heimdall/

RUN ./scripts/generate-keys.sh

# Remove dev dependencies after successful test
# This is equivalent to 'npm prune --production'
# RUN yarn install --production --ignore-scripts --prefer-offline

ENTRYPOINT [ "bash", "./scripts/entrypoint.sh" ]
