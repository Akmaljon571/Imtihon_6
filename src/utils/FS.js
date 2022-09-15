import fs from "fs"
import path from "path"

export const root = dir => {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), "src", "module", dir)))
}

export const white = (dir, data) => {
    return JSON.parse(fs.writeFileSync(path.join(process.cwd(), "src", "module", dir), JSON.stringify(data)))
}