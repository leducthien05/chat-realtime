const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
    cloud_name: "dt3lp2vht",
    api_key: "625188943665357",
    api_secret: "5VsPdU-Xep2OVojPi3OtY4zUwXk"
});

//Hàm upload file (ảnh/video) lên Cloudinary từ buffer (dữ liệu nhị phân trong RAM)
let streamUpload = (buffer) => {
    return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
            (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        );
        streamifier.createReadStream(buffer).pipe(stream);
    });
};

//Gọi upload lên Cloundinary
module.exports = async (buffer) => {
    let result = await streamUpload(buffer);
    return result.secure_url;
}