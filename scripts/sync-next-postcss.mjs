import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = dirname(__dirname)
const sourceDir = join(rootDir, 'node_modules', 'postcss')
const nextNodeModulesDir = join(rootDir, 'node_modules', 'next', 'node_modules')
const targetDir = join(nextNodeModulesDir, 'postcss')
const nextPackageJsonPath = join(rootDir, 'node_modules', 'next', 'package.json')

function copyDirectory(source, target) {
  const stats = statSync(source)
  if (!stats.isDirectory()) {
    throw new Error(`Expected directory at ${source}`)
  }

  mkdirSync(target, { recursive: true })

  for (const entry of readdirSync(source, { withFileTypes: true })) {
    const sourcePath = join(source, entry.name)
    const targetPath = join(target, entry.name)

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, targetPath)
      continue
    }

    cpSync(sourcePath, targetPath)
  }
}

if (!existsSync(sourceDir) || !existsSync(nextNodeModulesDir)) {
  console.warn('[sync-next-postcss] Skipped because postcss or next/node_modules is missing.')
  process.exit(0)
}

const postcssPackage = JSON.parse(readFileSync(join(sourceDir, 'package.json'), 'utf8'))
const nextPackage = JSON.parse(readFileSync(nextPackageJsonPath, 'utf8'))

rmSync(targetDir, { recursive: true, force: true })
copyDirectory(sourceDir, targetDir)

if (nextPackage.dependencies?.postcss !== postcssPackage.version) {
  nextPackage.dependencies = {
    ...nextPackage.dependencies,
    postcss: postcssPackage.version,
  }
  writeFileSync(nextPackageJsonPath, JSON.stringify(nextPackage, null, 2))
}

console.log(`[sync-next-postcss] Mirrored postcss ${postcssPackage.version} into next/node_modules/postcss`)
