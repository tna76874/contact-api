#!/bin/bash

export build_doc_date=$(date -u '+%d.%m.%Y')
export COMMIT_DATE=$(<server/COMMIT_DATE)
export COMMIT_HASH=$(<server/COMMIT_HASH)
export change_date_ds=$(git log -1 --format=%cd --date=format:'%d.%m.%Y' -- docs/datenschutz.md)


mkdocs serve
