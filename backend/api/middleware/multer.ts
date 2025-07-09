import multer, { StorageEngine } from "multer";
import { Request } from "express";
import { createWriteStream } from "fs";
import { tmpdir } from "os";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { getFirebase } from "../../database/firebase";
import fs from "fs/promises";

export class FirebaseStorage implements StorageEngine {
    async uploadToFirebase(
        localPath: string,
        firebaseFilePath: string,
        contentType: string
    ): Promise<string> {
        const bucket = getFirebase().storage().bucket();
        const token = uuidv4();

        await bucket.upload(localPath, {
            destination: firebaseFilePath,
            gzip: true,
            metadata: {
                metadata: {
                    firebaseStorageDownloadTokens: token,
                },
                contentType,
                cacheControl: "public, max-age=31536000",
            },
        });

        return `https://firebasestorage.googleapis.com/v0/b/${
            bucket.name
        }/o/${encodeURIComponent(firebaseFilePath)}?alt=media&token=${token}`;
    }

    _handleFile(
        req: Request,
        file: Express.Multer.File,
        cb: (error: any, info?: Partial<Express.Multer.File>) => void
    ) {
        const userId = req.user?._id + "-photoUrl";
        const fileExt = path.extname(file.originalname) || ".png";
        const filename = `${userId}${fileExt}`; // 👈 customize here
        const tempPath = path.join(tmpdir(), filename);
        const outStream = createWriteStream(tempPath);

        file.stream
            .pipe(outStream)
            .on("error", (err) => cb(err))
            .on("finish", async () => {
                try {
                    const url = await this.uploadToFirebase(
                        tempPath,
                        `uploads/${filename}`,
                        file.mimetype
                    );
                    await fs.unlink(tempPath);
                    cb(null, {
                        filename,
                        path: url,
                        // url,
                    });
                } catch (err: any) {
                    cb(err);
                }
            });
    }

    _removeFile(
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null) => void
    ) {
        const bucket = getFirebase().storage().bucket();
        bucket
            .file(`uploads/${file.filename}`)
            .delete()
            .then(() => cb(null))
            .catch(cb);
    }
}

const upload = multer({ storage: new FirebaseStorage() });

export default upload;
