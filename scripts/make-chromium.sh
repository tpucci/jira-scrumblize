#!/bin/bash
#
# This script assumes a linux environment

source ./config

echo "*** jira-scrumblize(Chromium): Creating app package"
echo "*** jira-scrumblize(Chromium): Copying files..."

DES=./dist/build/jira-scrumblize.chromium
rm -rf $DES
mkdir -p $DES
mkdir -p $DES/img/

cp -R ./pre-build/* $DES/

# Replace version
sed -i.bak 's/0.0.0.1/'$JIRA_SCRUMBLIZE_VERSION'/g' $DES/manifest.json
rm $DES/manifest.json.bak

echo "*** jira-scrumblize.chromium: Creating zip package..."
pushd $(dirname $DES/)
zip jira-scrumblize.chromium.zip -qr $(basename $DES/)/*
popd

echo "*** jira-scrumblize(Chromium): Package done."