'use strict'

const { readFile } = require('fs').promises
const { resolve } = require('path')

async function createWriterOpts () {
  const [template, header, commit] = await Promise.all([
    readFile(resolve(__dirname, './templates/template.hbs'), 'utf-8'),
    readFile(resolve(__dirname, './templates/header.hbs'), 'utf-8'),
    readFile(resolve(__dirname, './templates/commit.hbs'), 'utf-8')
  ])
  const writerOpts = getWriterOpts()

  writerOpts.mainTemplate = template
  writerOpts.headerPartial = header
  writerOpts.commitPartial = commit

  return writerOpts
}

module.exports.createWriterOpts = createWriterOpts

function getWriterOpts () {
  return {
    transform: (commit) => {
      if (!commit.component || typeof commit.component !== 'string') {
        return
      }

      if (typeof commit.hash === 'string') {
        commit.shortHash = commit.hash.substring(0, 7)
      }

      commit.references.forEach(function (reference) {
        if (reference.prefix === '#') {
          reference.originalIssueTracker = 'https://bugs.jquery.com/ticket/'
        }
      })

      return commit
    },
    groupBy: 'component',
    commitGroupsSort: 'title',
    commitsSort: ['component', 'shortDesc']
  }
}
