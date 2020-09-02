/**
 * png文件转成sprite.png和sprite.json
 * @param {string} iconsDir     存放png文件的文件夹
 * @param {string} spriteDir    存放sprite.png和sprite.json文件的文件夹
 */
let png2sprite = (iconsDir, spriteDir) => {

    /**
     * @param {*images} sprite 需要绘制的图像
     * @param {*Number} hindex 起始y坐标
     * @param {*[iconObj]} iconsRow 需要绘制在行内的iconObj
     */
    let drawInRow = (sprite, iconJsons, hindex, iconsRow) => {
        let sum_x = 0;
        iconsRow.forEach(icon => {
            let iconJson = {
                "x": sum_x,
                "y": hindex,
                "width": icon.width,
                "height": icon.height,
                "pixelRatio": 1,
                "visible": true
            }
            sprite.draw(icon.image, sum_x, hindex);
            iconJsons[icon.name] = iconJson;
            sum_x += icon.width;
        })

    }

    /**
     * 文件遍历方法,遍历一层
     * @param {string} filePath 需要遍历的文件路径
     */
    let fileDisplay = (dir) => {
        var pngfileList = []
        //根据文件路径读取文件，返回文件列表

        let files = fs.readdirSync(dir);

        if (files) {
            result = files.map((file) => {
                let filePath = path.join(dir, file);
                let filenameRex = file.split('.')
                if (fs.statSync(filePath).isFile() && filenameRex[filenameRex.length - 1] === "png") {
                    return filePath
                } else {
                    console.warn(file + "不是.png文件");
                }
            });
        }
        result.forEach(item => {
            if (item) {
                pngfileList.push(iconObj(String(item)))
            }
        })
        return pngfileList;
    }

    /**
     * 返回一个icon的json对象
     * @param {string} iconpath 
     */
    let iconObj = (iconpath) => {
        return {
            "name": path.parse(iconpath).name,
            "image": images(iconpath),
            "x": 0,
            "y": 0,
            "width": images(iconpath).width(),
            "height": images(iconpath).height(),
            "pixelRatio": 1,
            "visible": true
        }
    }


    let fs = require('fs');
    let path = require('path');
    let images = require("images");
    // let iconsPath = __dirname + "/icons";
    // 把所有icon路径存到list里
    let icons = fileDisplay(iconsDir)

    // 根据高度从小到大排序
    icons.sort((a, b) => {
        if (a.height > b.height)
            return 1;
        else if (a.height < b.height)
            return -1;
        else
            return 0;
    });
    // console.log(icons[0]);

    // 默认sprite宽度为255
    iconsRows = []
    sumWidth = 0
    sumWidths = []
    iconsRow = []
    icons.forEach(icon => {
        sumWidth += icon.width
        if (sumWidth > 800) {
            iconsRows.push(iconsRow)
            // 清空计数器
            iconsRow = []
            sumWidths.push(sumWidth)
            sumWidth = 0
        }
        iconsRow.push(icon)
    })
    //最后一行加入到iconRows
    iconsRows.push(iconsRow)

    // 计算需要的高度
    height = 0
    iconsRows.forEach(row => {
        height += Math.max.apply(Math, row.map(function (o) { return o.height }))
    })

    // console.log(height);
    // sprite.png图像，利用sumWidths求出图像最大宽度
    let sprite = images(sumWidths.sort((a, b) => (b - a))[0], height);
    // sprite.json索引文件
    let iconJsons = {}
    hindex = 0
    for (var i = 0; i < iconsRows.length; i++) {
        // 绘制起始的高度
        // 第0行
        if (i === 0) {
            hindex = 0;
            drawInRow(sprite, iconJsons, hindex, iconsRows[i])
        }
        else {
            hindex += Math.max.apply(Math, iconsRows[i - 1].map(function (o) { return o.height }))
            // console.log(hindex);
            drawInRow(sprite, iconJsons, hindex, iconsRows[i])
        }

    }

    fs.createWriteStream(spriteDir + "/sprite.json").write(JSON.stringify(iconJsons))
    sprite.save(spriteDir + "/sprite.png", "png");
    console.log("png2sprite success!");
}


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

module.exports = {
    png2sprite,
    sprite2pngs
}