#!/usr/bin/env node
/**
 * Simple script to display jira-mate.json configuration
 * Works even if jira-mate CLI is not built
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = path.join(process.cwd(), 'jira-mate.json');

if (!fs.existsSync(configPath)) {
  console.error('Error: jira-mate.json not found in project root');
  process.exit(1);
}

try {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  
  console.log(`Jira: ${config.jiraBaseUrl}`);
  console.log(`Default issue type: ${config.defaultIssueType}`);
  console.log('');
  
  if (config.projects && Array.isArray(config.projects)) {
    config.projects.forEach((project) => {
      console.log(`- ${project.displayName} [${project.jiraProjectKey}]`);
      console.log(`  slug: ${project.slug}`);
      console.log(`  repoPath: ${project.repoPath}`);
      if (project.progress) {
        console.log(`  progress root: ${project.progress.root}`);
        console.log(`  epics file: ${project.progress.epicsFile}`);
        console.log(`  stories dir: ${project.progress.storiesDir}`);
        console.log(`  bugs file: ${project.progress.bugsFile}`);
      }
      console.log('');
    });
  } else {
    console.log('No projects configured.');
  }
} catch (error) {
  console.error('Error reading jira-mate.json:', error.message);
  process.exit(1);
}

