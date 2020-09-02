
/**
 * sprite.png和sprite.json转成png文件
 * @param {*} spriteDir   存放sprite.png和sprite.json文件的文件夹
 * @param {*} iconsDir    存放png文件的文件夹
 */
let sprite2pngs = (spriteDir, iconsDir) => {

    // 读取sprite json文件
    let fs = require('fs');
    let images = require("images");

    let readStream = fs.createReadStream(spriteDir + "/sprite.json", 'utf-8');
    let data = []

    readStream.on("data", function (trunk) {
        data.push(trunk)
    })
    // console.log(sprite_idx);
    readStream.on("end", function () {
        // console.log(JSON.parse(data));

        iconsProfile = JSON.parse(data)
        //读取sprite大图
        let sprite = images(spriteDir + "/sprite.png");

        Object.keys(iconsProfile).forEach(name => {
            // console.log(name);
            item = iconsProfile[name]
            let icon = images(sprite, item.x, item.y, item.width, item.height)
            icon.save(iconsDir + "/" + name + ".png", "png")
        });
        console.log("sprite2pngs success!");
    })
}

module.exports = sprite2pngs;


