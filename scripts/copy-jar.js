const fs = require('fs')
const path = require('path')

const clientRoot = path.join(__dirname, '..')
const botLibs = path.join(clientRoot, '..', 'yongviewbot', 'build', 'libs')
const resourcesDir = path.join(clientRoot, 'resources')
const destJar = path.join(resourcesDir, 'yongviewbot.jar')

if (!fs.existsSync(botLibs)) {
  console.error('yongviewbot/build/libs not found. Run "gradlew bootJar" in yongviewbot first.')
  process.exit(1)
}

const jars = fs.readdirSync(botLibs).filter(f => f.startsWith('yongviewbot-') && f.endsWith('.jar'))
if (jars.length === 0) {
  console.error('No yongviewbot-*.jar in build/libs. Run "gradlew bootJar" in yongviewbot first.')
  process.exit(1)
}

if (!fs.existsSync(resourcesDir)) fs.mkdirSync(resourcesDir, { recursive: true })
fs.copyFileSync(path.join(botLibs, jars[0]), destJar)
console.log('Copied', jars[0], '-> resources/yongviewbot.jar')
