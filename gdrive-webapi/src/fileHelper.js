import fs from 'fs'
import prettyBytes from 'pretty-bytes'

export default class FileHelper {

    static async getFileStatus(downloadsFolder) {
        const currentFiles = await fs.promises.readdir(downloadsFolder);
        console.log(currentFiles)
        const statuses = await Promise.all(
            currentFiles.map(
                file => fs.promises.stat(`${downloadsFolder}/${file}`)
            )
        );

        const fileStatuses = [];
        for (const fileIndex in currentFiles) {
            const { birthtime, size } = statuses[fileIndex];//todos os dados do arquivo
            fileStatuses.push({
                size: prettyBytes(size),
                file: currentFiles[fileIndex], //apenas o nome do arquivo
                lastModified: birthtime,
                owner: process.env.USER
            });
        }

        return fileStatuses;
    }
}