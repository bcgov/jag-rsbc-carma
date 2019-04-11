# Pull in nodejs-8 centos container
FROM centos/nodejs-8-centos7

# Temp Directory for downloads
RUN TMPDIR="$HOME/tmp" && \
    mkdir -p $TMPDIR && \
    cd $TMPDIR

# Install Yarn and Add it to the path
RUN curl -o- -L https://yarnpkg.com/install.sh | bash
ENV PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH"

# Cleanup
RUN cd / && \
    rm -rf $TMPDIR

# Set the PORT so that our node app starts on 8080
ENV PORT=8080
