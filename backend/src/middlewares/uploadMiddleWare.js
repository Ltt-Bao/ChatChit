import multer from 'multer';

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
});

export const upLoadImageFromBuffer = (buffer, options) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({
            folder: "chatchit/avatars",
            resource_type: "image",
            transfomation: [{with: 200, height: 200, crop: "fill"}],
            ...options,
        },
        (error, result) => {
            if(error) {
                reject(error);
            } else {
                resolve(result);
            }
        }
        );

        uploadStream.end(buffer);
    });
};
