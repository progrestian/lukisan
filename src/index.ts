import * as fs from 'fs'
import * as path from 'path'
import commander from 'commander';
import { Config, Secret } from './types'
import { DeviantartFetcher } from './fetchers/deviantart'
import { SwayManager } from './managers/sway'

const configdir = (process.env.XDG_CONFIG_HOME)
    ? path.join(process.env.XDG_CONFIG_HOME, 'lukisan')
    : (process.env.HOME)
        ? path.join(process.env.HOME, '.config', 'lukisan')
        : path.join('/', 'etc', 'lukisan')

const localdir = (process.env.XDG_DATA_HOME)
    ? path.join(process.env.XDG_DATA_HOME, 'lukisan')
    : (process.env.HOME)
        ? path.join(process.env.HOME, '.local', 'share', 'lukisan')
        : path.join('/', 'etc', 'lukisan')

const config: Config = JSON.parse(fs.readFileSync(path.join(configdir, 'config.json'), 'utf-8'))
const secret: Secret = JSON.parse(fs.readFileSync(path.join(localdir, 'secrets.json'), 'utf-8'))

const program = commander.program;

program
    .version('0.1.0')
    .description('Artwork fetcher and wallpaper manager')

program
    .command('fetch')
    .description('fetch images from all fetchers')
    .action(async () => {
        fs.rmdirSync(path.join(localdir, 'images'), { recursive: true })
        fs.mkdirSync(path.join(localdir, 'images'))

        if (config.fetchers.includes('all') || config.fetchers.includes('deviantart')) {
            const deviantartFetcher = new DeviantartFetcher(localdir)
            await deviantartFetcher.fetch(secret)
        }
    })

program
    .command('next')
    .description('cycle to next wallpaper')
    .action(() => {
        if (config.manager === 'sway') {
            const swayManager = new SwayManager(localdir)
            swayManager.next()
        }
    })

program
    .command('prev')
    .description('cycle to previous wallpaper')
    .action(() => {
        if (config.manager === 'sway') {
            const swayManager = new SwayManager(localdir)
            swayManager.prev()
        }
    })


program.parse(process.argv)
