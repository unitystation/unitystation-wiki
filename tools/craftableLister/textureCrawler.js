const fs = require('fs');
const utils = require('./listerUtils');

const basePath = 'C:/git/unitystation/UnityProject';

let textureDictionary = {};

const crawlTextures = (basePath) => {
  console.log('Crawling images, please wait...');
  let textureFiles = [];

  return new Promise((resolve) => {
    let foldersLoaded = 0;

    const doResolve = () => {
      foldersLoaded++;
      if (foldersLoaded !== 2) {
        return;
      }

      const nrFiles = textureFiles.length;
      textureFiles.forEach((metaFilePath, idx) => {
        const metaFile = utils.fileToObject(metaFilePath)[0];
        let filePath = metaFilePath.replace('.meta', '').replace('.asset', '');
        // ::CONVENTION WARNING:: sometimes there referenced file ia not a .png file, but a .asset that points to a .meta that points to a .png
        // we presume that they have the same name, and just add .png !!
        // lazy way to not create 2 lists and cross-check both
        if (filePath.indexOf('.png') === -1) filePath += '.png';
        textureDictionary[metaFile.guid] = filePath;

        if (idx % 150 === 0) {
          const proc = Math.floor(idx / nrFiles * 10000) / 100;
          process.stdout.write(`Processing textures: ${proc}%\r`);
        }
      });

      process.stdout.write('Processing textures: Done         \r\n');
      resolve(textureDictionary);
    };

    const iconsPath = basePath + '/Assets/Resources/Icons';
    utils.walk(iconsPath, (err, res) => {
      if (err) throw new Error(err);

      textureFiles = textureFiles.concat(res.filter(
        (arg) => arg.indexOf('.meta') !== -1
      ));
      doResolve();
    });

    const texturePath = basePath + '/Assets/Textures'; //  /items/food/burgerbread
    utils.walk(texturePath, (err, res) => {
      if (err) throw new Error(err);

      textureFiles = textureFiles.concat(res.filter(
        (arg) => arg.indexOf('.meta') !== -1
      ));
      doResolve();
    });
  });
};

const crawlPrefabs = (basePath) => {
  let prefabFiles = [];
  const prefabDictionary = {};

  console.log('Crawling prefabs, please wait...');
  return new Promise((resolve) => {
    const texturePath = basePath + '/Assets/Resources/Prefabs'; //  /Items/Food/Snacks/BreadSnacks
    utils.walk(texturePath, (err, res) => {
      if (err) throw new Error(err);

      prefabFiles = res.filter(
        (arg) => arg.indexOf('.prefab.meta') !== -1
      );

      const nrFiles = prefabFiles.length;
      prefabFiles.forEach((file, idx) => {
        if (idx % 150 === 0) {
          const proc = Math.floor(idx / nrFiles * 10000) / 100;
          process.stdout.write(`Processing prefabs: ${proc}%\r`);
        }

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
            spritePng: textureDictionary[spriteId]
          };
        } else {
          //          console.log('broken prefab: ', file);
        }
      });

      process.stdout.write('Processing prefasb: Done         \r\n');

      resolve(prefabDictionary);
    });
  });
};

const exportTextures = async () => {
  textureDictionary = await crawlTextures(basePath);

  const finalText = `// generated at ${new Date().toString().slice(0, 10)}
// contains ${Object.keys(textureDictionary).length} items

const textures = ${JSON.stringify(textureDictionary)}

module.exports = textures;`;

  if (fs.existsSync('textures.js')) fs.unlinkSync('textures.js');
  fs.writeFile('textures.js', finalText, () => {});

  return ('done');
};

// export prefab data
const exportPrefabs = async () => {
  const prefabDictionary = await crawlPrefabs(basePath);

  let prefabsTxt = '';
  for (const key in prefabDictionary) {
    const prefab = prefabDictionary[key];
    prefabsTxt += `"${key.toString()}": ${JSON.stringify(prefab)}, \r\n`;
  };

  const finalText = `// generated at ${new Date().toString().slice(0, 10)}
// contains ${Object.keys(prefabDictionary).length} items

const prefabs = { ${prefabsTxt} }

module.exports = prefabs;`;

  if (fs.existsSync('prefabs.js')) fs.unlinkSync('prefabs.js');
  fs.writeFile('prefabs.js', finalText, () => {});
};

const init = async () => {
  await exportTextures();
  exportPrefabs();
};

init();
