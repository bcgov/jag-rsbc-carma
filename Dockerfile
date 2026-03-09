# ##################################################################################################
#                                                                                                 #
#   CARMA-VIP-ADAPTOR: Node.js REST API Integration Service                                      #
#                                                                                                 #
#   LOCAL VERIFICATION:                                                                           #
#   docker build -f Dockerfile --build-arg BUILD_IMAGE_NAME=carma-vip-adaptor --build-arg BUILD_VERSION=local -t carma-vip-adaptor:local .
#   docker run -p 8080:8080 --env-file .env carma-vip-adaptor:local                              #
#                                                                                                 #
#   ARCHITECTURE & BUILD OVERVIEW                                                                 #
#   --------------------------------------------------------------------------------------------  #
#   - Multi-stage Docker build for Node.js backend                                                #
#   - Runtime container runs as non-root user (node) for security                                #
#   - All files in /opt/app-root/src are owned by node:node                                      #
#   - Build metadata (BUILD_IMAGE_NAME, BUILD_VERSION) available as env vars.                     #
#   - Compatible with OpenShift Source-to-Image (S2I) deployment model                            #
#                                                                                                 #
# ##################################################################################################

# --- Build Arguments (Global) ---
ARG BUILD_IMAGE_NAME
ARG BUILD_VERSION

# --- Build Stage ---
FROM registry.access.redhat.com/ubi8/nodejs-16-minimal:latest AS build
ARG BUILD_IMAGE_NAME
ARG BUILD_VERSION

USER 0

WORKDIR /opt/app-root/src

# Copy package files for dependency installation
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production --ignore-scripts

# Copy application source code
COPY . .

# Set ownership to node user
RUN chown -R 1001:0 /opt/app-root

# --- Final Runtime Image ---
FROM registry.access.redhat.com/ubi8/nodejs-16-minimal:latest AS final
ARG BUILD_IMAGE_NAME
ARG BUILD_VERSION

USER 0

# Update all system packages for latest security patches
RUN microdnf update -y && \
    microdnf clean all && \
    rm -rf /var/cache/yum

WORKDIR /opt/app-root/src

# Copy application and dependencies from build stage
COPY --from=build --chown=1001:0 /opt/app-root/src .

# Debug: Verify build args are set
RUN echo "BUILD_IMAGE_NAME='$BUILD_IMAGE_NAME'" && if [ -z "$BUILD_IMAGE_NAME" ]; then echo "BUILD_IMAGE_NAME is empty!"; exit 1; fi
RUN echo "BUILD_VERSION='$BUILD_VERSION'" && if [ -z "$BUILD_VERSION" ]; then echo "BUILD_VERSION is empty!"; exit 1; fi

# Set environment variables for traceability
ENV BUILD_IMAGE_NAME=${BUILD_IMAGE_NAME}
ENV BUILD_VERSION=${BUILD_VERSION}

# Expose application port
EXPOSE 8080

# Switch to non-root user for runtime (OpenShift compatible)
USER 1001

# Start the application
CMD ["node", "index.js"]
