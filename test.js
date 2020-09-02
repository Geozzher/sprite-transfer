let tools = require('./index');


// png文件合成sprite.png和sprite.json
tools.png2sprite(__dirname + '/statics/icons', __dirname + '/output');
// 根据sprite.json将sprite.png切分成png文件
tools.sprite2pngs(__dirname + '/statics/sprite', __dirname + '/output');