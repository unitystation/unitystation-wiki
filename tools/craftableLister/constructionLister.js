/* eslint-disable node/handle-callback-err */
const fs = require('fs');
const utils = require('./listerUtils');

const prefabs = require('./prefabs');
const textures = require('./textures2');

// list of all the construction materials
let materialsFiles = []; // .meta files
let materialsDictionary = {};

// list of all the build
let buildFiles = []; // .meta files
const buildDictionary = {};

const prefabFiles = []; // .meta files
const prefabObjects = {};

// list of all textures
const textureFiles = []; // png files, all of them
const spriteIdToImageDictionary = {}; // guid -> png file dictionary

/**
load the c:\git\unitystation\UnityProject\Assets\Resources\ScriptableObjects\Construction\BuildList\

 */

let foldersRead = 0;

// basepath to the unityProject folder
const basePath = 'C:/git/unitystation/UnityProject';

// step 1> load the materials and their buildLists!
// c:\git\unitystation\UnityProject\Assets\Resources\Prefabs\Items\Construction\Materials\Resources\
const materialsPath = basePath + '/Assets/Resources/Prefabs/Items/Construction/Materials/Resources';
utils.walk(materialsPath, (err, res) => {
  // only the .asset interest us
  materialsFiles = res.filter(
    (arg) => arg.indexOf('.prefab.meta') !== -1
  );
  foldersRead++;
  init();
});

// step 2. read the build list files
const constructionPath = basePath + '/Assets/Resources/ScriptableObjects/Construction/BuildList';
utils.walk(constructionPath, (err, res) => {
  // only the .asset interest us
  buildFiles = res.filter(
    (arg) => arg.indexOf('.meta') !== -1
  );
  foldersRead++;
  init();
});

const init = () => {
  const finalListV2 = {};
  /**
   * example
  finallistVs["metal rods"] = {
    spriteId:
    buildListID:
    entries: [{
      name,
      prefabId,
      cost,
    }
    ...
    ]
  }

   */

  if (foldersRead !== 2) {
    return;
  }
  // STEP 1: read the materials and their corresponding build list
  materialsDictionary = utils.loadPrefabs(materialsFiles);
  Object.values(materialsDictionary).forEach(buildingMaterial => {
    const name = buildingMaterial.rawText
      .split('propertyPath: initialName')[1]
      ?.split('value: ')[1]
      ?.split('\n')[0]
      ?.replace('\r', '');

    const spriteId = buildingMaterial.rawText
      .split('propertyPath: m_Sprite')[1]
      ?.split('guid: ')[1]
      ?.split(',')[0];

    const buildListId = buildingMaterial.rawText
      .split('buildList')[1]
      ?.split('guid: ')[1]
      ?.split(',')[0];
    if (name && spriteId && buildListId) {
      finalListV2[name] = {
        spriteId,
        buildListId
      };
    }
  });

  buildFiles.forEach(file => {
    const buildMetaFile = utils.fileToObject(file)[0];
    const buildFile = utils.fileToObject(file.split('.meta')[0])[0];

    buildDictionary[buildMetaFile.guid] = buildFile.MonoBehaviour.entries;
  });

  for (const key in finalListV2) {
    const material = finalListV2[key];
    const craftables = buildDictionary[material.buildListId];
    if (!material.entries) material.entries = [];
    craftables.forEach(craftable => {
      material.entries.push({
        name: craftable.name,
        cost: craftable.cost,
        spritePng: prefabs[craftable.prefab.guid]?.spritePng
      });
    });
  };

  let finalTable = '';
  for (const key in finalListV2) {
    const categoryName = key;
    let materialPng = spriteIdToImageDictionary[finalListV2[key].spriteId];
    if (materialPng !== undefined) materialPng = materialPng?.split('\\').pop();
    finalTable += `## ${categoryName} [${categoryName}](${materialPng}) \r\n`;
    finalTable += '| Picture | Name | Cost |\r\n';
    finalTable += '| ---- | ---- | ---- |\r\n';

    const craftables = finalListV2[key].entries;

    craftables.forEach(item => {
      finalTable += `| [${item.name}](${item.spritePng?.split('\\').pop()}) |`;
      finalTable += ` ${item.name} |`;
      finalTable += ` ${item.cost} | \r\n`;
    });
    finalTable += '\r\n\r\n';
  }

  if (fs.existsSync('construction.txt')) fs.unlinkSync('construction.txt');
  fs.writeFile('construction.txt', finalTable, () => {});

  const a = 1;

  return;

  const finalList = {};

  for (const key in buildDictionary) {
    const list = buildDictionary[key];
    finalList[key] = [];
    list.forEach(craftable => {
      const prefabGuid = craftable.prefab.guid;
      const prefabSprite = prefabObjects[prefabGuid]?.spritePng;
      finalList[key].push({
        name: craftable.name,
        cost: craftable.cost,
        sprite: prefabSprite,
        buildTime: craftable.buildTime
      });
    });
  }
};
