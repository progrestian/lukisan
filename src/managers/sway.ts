import * as child_process from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import { Manager } from '../types'

export class SwayManager extends Manager {
    next(): void {
        let percentage = 0
        let images: string[] = []

        try {
            percentage = parseFloat(fs.readFileSync(path.join(this.localdir, 'current.txt'), 'utf-8'));
        } catch { }

        try {
            images = fs.readdirSync(path.join(this.localdir, 'images')).map(filename => path.join(this.localdir, 'images', filename))
        } catch { }

        child_process.execSync(`swaymsg output "*" bg "${images[Math.floor(percentage * images.length)]}" fill`)
        percentage = (percentage + (1 / images.length)) % 1
        fs.writeFileSync(path.join(this.localdir, 'current.txt'), percentage.toString(), { flag: 'w' })
    }

    prev(): void {
        let current = 0
        let images: string[] = []

        try {
            current = parseFloat(fs.readFileSync(path.join(this.localdir, 'current.txt'), 'utf-8'));
        } catch { }

        try {
            images = fs.readdirSync(path.join(this.localdir, 'images')).map(filename => path.join(this.localdir, 'images', filename))
        } catch { }

        current = (images.length == 0) ? 0 : current
        child_process.execSync(`swaymsg output "*" bg "${images[Math.floor(current * images.length)]}" fill`)
        fs.writeFileSync(path.join(this.localdir, 'current.txt'), ((current + 1) / images.length).toString(), { flag: 'w' })
    }
}