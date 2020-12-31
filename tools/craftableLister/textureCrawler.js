const fs = require('fs');
const utils = require('./listerUtils');

const textures = require('./textures2');

const crawlTextures = (basePath) => {
  let textureFiles = [];
  const textureDictionary = {};

  return new Promise((resolve) => {
    const texturePath = basePath + '/Assets/Textures'; //  /items/food/burgerbread
    utils.walk(texturePath, (err, res) => {
      if (err) throw new Error(err);

      textureFiles = res.filter(
        (arg) => arg.indexOf('.meta') !== -1
      );

      textureFiles.forEach(metaFilePath => {
        const metaFile = utils.fileToObject(metaFilePath)[0];
        let filePath = metaFilePath.replace('.meta', '').replace('.asset', '');
        // ::CONVENTION WARNING:: sometimes there referenced file ia not a .png file, but a .asset that points to a .meta that points to a .png
        // we presume that they have the same name, and just add .png !!
        // lazy way to not create 2 lists and cross-check both
        if (filePath.indexOf('.png') === -1) filePath += '.png';
        // filePath = filePath.replace(new RegExp(/\\/g), '\\\\');
        // filePath = filePath.replace(new RegExp(/\'/g), "\\'");
        textureDictionary[metaFile.guid] = filePath;
      });
      //      const textureMetaFile

      resolve(textureDictionary);
    });
  });
};

const basePath = 'C:/git/unitystation/UnityProject';

const crawlPrefabs = (basePath) => {
  let prefabFiles = [];
  const prefabDictionary = {};

  return new Promise((resolve) => {
    const texturePath = basePath + '/Assets/Resources/Prefabs'; //  /Items/Food/Snacks/BreadSnacks
    utils.walk(texturePath, (err, res) => {
      if (err) throw new Error(err);

      prefabFiles = res.filter(
        (arg) => arg.indexOf('.prefab.meta') !== -1
      );

      prefabFiles.forEach(file => {
        const prefabMetaFile = utils.fileToObject(file)[0];
        const prefabFile = utils.fileToObject(file.split('.meta')[0]);
        let name = prefabFile.rawText
          .split('propertyPath: initialName')[1]
          ?.split('value: ')[1]
          ?.split('\n')[0]
          ?.replace('\r', '');

        if (name === undefined) {
          name = prefabFile.rawText
            .split('initialName: ')[1]
            ?.split('\n')[0]
            ?.replace('\r', '');
        }

        if (name === undefined) {
          name = prefabFile.rawText
            .split('propertyPath: m_Name')[1]
            ?.split('value: ')[1]
            ?.split('\n')[0]
            ?.replace('\r', '');
        }
        // last resort
        if (name === undefined) {
          name = prefabFile.rawText
            .split('m_Name: ')[1]
            ?.split('\n')[0]
            ?.replace('\r', '');
        }

        let spriteId = prefabFile.rawText
          .split('propertyPath: m_Sprite')[1]
          ?.split('guid: ')[1]
          ?.split(',')[0];

        if (spriteId === undefined) {
          spriteId = prefabFile.rawText
            .split('m_Sprite: ')[1]
            ?.split('guid: ')[1]
            ?.split(',')[0];
        }

        if (name !== undefined && spriteId !== undefined) {
          prefabDictionary[prefabMetaFile.guid] = {
            name,
            spriteId,
            spritePng: textures[spriteId]
          };
        } else {
          console.log('broken prefab: ', file);
        }
      });

      resolve(prefabDictionary);
    });
  });
};

const exportPrefabs = async () => {
  const prefabDictionary = await crawlPrefabs(basePath);

  let prefabsTxt = '';
  for (const key in prefabDictionary) {
    const prefab = prefabDictionary[key];
    prefabsTxt += `${key.toString()}: ${JSON.stringify(prefab)} \r\n`;
  };

  const finalText = `// generated at ${new Date().toString().slice(0, 10)}
// contains ${Object.keys(prefabDictionary).length} items

const prefabs = { ${prefabsTxt} }

module.exports = prefabs;`;

  if (fs.existsSync('prefabs.js')) fs.unlinkSync('prefabs.js');
  fs.writeFile('prefabs.js', finalText, () => {});
};

exportPrefabs();
// process.stdout.write("Downloading " + data.length + " bytes\r");

// const exportTextures = async () => {
//   const textureDictionary = await crawlTextures(basePath);

//   // let textures = '';
//   // for (const key in textureDictionary) {
//   //   textures += ` '${key}': '${textureDictionary[key]}', \r\n`;
//   // }
//   const finalText = `// generated at ${new Date().toString().slice(0, 10)}
// // contains ${Object.keys(textureDictionary).length} items

// const textures = ${JSON.stringify(textureDictionary)}

// module.exports = textures;`;

//   if (fs.existsSync('textures2.js')) fs.unlinkSync('textures2.js');
//   fs.writeFile('textures2.js', finalText, () => {});
// };

// exportTextures();
