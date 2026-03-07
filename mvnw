#!/bin/sh
# Maven Wrapper script - downloads and runs Maven

set -e

MAVEN_HOME="${HOME}/.m2/wrapper/dists/apache-maven-3.9.6"
MAVEN_URL="https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.6/apache-maven-3.9.6-bin.zip"

if [ ! -f "${MAVEN_HOME}/bin/mvn" ]; then
    echo "Downloading Maven 3.9.6..."
    mkdir -p "${MAVEN_HOME}"
    TMP_FILE=$(mktemp)
    curl -sL "${MAVEN_URL}" -o "${TMP_FILE}"
    unzip -qo "${TMP_FILE}" -d "${HOME}/.m2/wrapper/dists/"
    rm -f "${TMP_FILE}"
    mv "${HOME}/.m2/wrapper/dists/apache-maven-3.9.6" "${MAVEN_HOME}" 2>/dev/null || true
fi

export PATH="${MAVEN_HOME}/bin:${PATH}"
exec mvn "$@"
