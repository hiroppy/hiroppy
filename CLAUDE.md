# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio/data aggregation project for hiroppy, published as an npm package. It crawls and processes various data sources (articles, talks, repos, jobs, podcasts, etc.) to generate JSON files and optimized images for use in other projects.

## Development Commands

- `pnpm run build` - Main build process that generates all data files and processes images
- `pnpm run build:readme` - Generates/updates the README.md file
- `pnpm run lint` - Runs Biome linting and fixes issues automatically
- `pnpm run reset` - Clears generated directory and recreates it
- `pnpm run cleanup` - Removes unused images from the generated/images directory
- `pnpm run compress:images` - Compresses images using Sharp
- `pnpm run decompress:images` - Decompresses images (runs on postinstall)

## Architecture

### Data Processing Pipeline
The build system follows a caching and crawling architecture:

1. **Cache Management** (`scripts/utils.ts`): Uses AsyncLocalStorage for shared caching across all data generation scripts
2. **Data Sources** (`data/` directory): Contains TypeScript files defining data structures and sources
3. **Scripts** (`scripts/` directory): Individual processors for each data type (articles, jobs, repos, etc.)
4. **Generated Output** (`generated/` directory): Contains final JSON files and optimized images

### Key Components

- **Main Build Process** (`scripts/index.ts`): Orchestrates parallel execution of all data processors with shared cache
- **Web Crawling** (`scripts/utils.ts`): Fetches metadata from URLs, downloads and optimizes images using Sharp
- **Image Processing**: Converts images to WebP format with base64-encoded filenames for caching
- **GitHub Integration** (`lib/github.mjs`): Provides utilities for fetching repository data via Octokit

### Data Flow
1. Load existing cache from `data/cache.json`
2. Run all data processors in parallel with shared cache context
3. Each processor crawls URLs, fetches metadata, and processes images
4. Generated JSON files are sorted by date and saved to `generated/` directory
5. Updated cache is saved back to `data/cache.json`

## Environment Requirements

- **GITHUB_TOKEN**: Required for GitHub API access when processing repository data
- **Node.js**: Project uses ES modules with TypeScript
- **pnpm**: Package manager (version 10.11.0)

## File Structure

- `data/` - Source data definitions and cache storage
- `scripts/` - Build scripts for processing different data types
- `generated/` - Output directory for processed JSON and images
- `lib/` - Utility functions (GitHub API helpers)
- `public/` - Static assets (company logos, etc.)

## Code Style

- Uses Biome for formatting and linting
- 80 character line width
- Space indentation
- Import organization enabled