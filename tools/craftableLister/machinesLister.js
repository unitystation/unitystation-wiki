const fs = require('fs');
const path = require('path');
const { resolve } = require('path');
const { inherits } = require('util');
const utils = require('./listerUtils');
const prefabs = require('./prefabs');

const BASE_PATH = 'C:/git/unitystation/UnityProject';

const machineBoardFiles = [];
const machineBoardsDictionary = {};

const crawlScripts = () => {
  return new Promise(resolve => {
    const craftableMachines = {};

    const texturePath = BASE_PATH + '/Assets/Resources/ScriptableObjects/Construction/MachineParts';
    utils.walk(texturePath, (err, res) => {
      if (err) throw new Error(err);

      const metaFiles = res.filter(
        (arg) => arg.indexOf('.asset.meta') !== -1
      );

      metaFiles.forEach(file => {
        const scriptMetaFile = utils.fileToObject(file)[0];
        const scriptFile = utils.fileToObject(file.split('.meta')[0])[0];

        const machineId = scriptFile.MonoBehaviour.machine.guid;
        const machineName = prefabs[machineId]?.name;
        const machineSprite = prefabs[machineId]?.spritePng;
        let partsAreValid = true;
        const machineParts = scriptFile.MonoBehaviour.machineParts.map(el => {
          if (prefabs[el.basicItem.guid]?.name === undefined) { partsAreValid = false; }
          return {
            id: el.basicItem.guid,
            name: prefabs[el.basicItem.guid]?.name,
            amount: el.amountOfThisPart
          };
        });

        craftableMachines[scriptMetaFile.guid] = {
          machineId,
          machineName,
          machineSprite,
          machineParts,
          partsAreValid
        };
      }); // end read
      resolve(craftableMachines);
    }); // endwalk
  });
};

const init = async () => {
  // REMOVED TO SPEED UP DEV. DO NOT PUSH!
//   const machineBoards = await crawlMachineBoards();

  // REMOVED TO SPEED UP DEV. DO NOT PUSH!
  // const machineIds = await crawlPrefabs(BASE_PATH);

  // DEV ONLY. REMOVE IN PUSH!
  //  const machines = [{ id: '133b93fb7d8a5794bbfff599bea64863', board: '3c4ccc974a921654f884c3a90188d75e', machineParts: '645d2af232083e545930ac3d55f4a641' }, { id: '6636f7f06ebca7f43b628d50694e56c6', board: 'dd0556b2e76bfac48bfb3217e1177605', machineParts: 'fb6b786c3a5d4df45a8fe68e806a5d4a' }, { id: 'c5aecb2f211bbae49916919ff6128733', board: '0068bc8f1fd50c54a978e30b4c416e2c', machineParts: '2c0fe27389c841346aed1fb4e23e3ba7' }, { id: '8fb17c682e60f4199b549d714a6a6d00', board: '9fbd8dbfb604acf46a546a4b1ed1806c', machineParts: 'bb4786fe8ad1f4547910b14651b75b87' }, { id: '1efec61511b50c844868cb49d1a711a1', board: 'c0cbb1853d350404685a523d617f3458', machineParts: '3a2e910deacfcfd4facaa1e17a6c00d5' }, { id: 'e73fd808d968047a79fcb334789f6aa6', board: '4690b98493f1ab64f85223bfebcb455e', machineParts: '083d3cdeea534054388d1317ffea8779' }, { id: '7f4f2e2c3cbc24e3d9dbac6895d97efb', board: '89f38936254ca964a85299ce289225ad', machineParts: 'abefc5c6841376d4b9ca82ac2438e04f' }, { id: '1581b03bb13b84328a0f9fe743bb5bbf', board: 'c242e43da5bd5cb418a0cdccf5cf1358', machineParts: '7efd7855b5dccc04ca1d549cf9a18301' }, { id: '85791fbcb6be942d1b318907cb2edec3', board: '1a647f4dd2f499d40b782ae9b88a5f51', machineParts: '451638b6b2b9c7d4b8850e1e42fea78d' }, { id: 'd72e24d0fc40a7545aad2f4e4f978d33', board: '1002c0247e412884e91c857ce6e51d9c', machineParts: '017b3c9cd22f04f4bb668954764b1381' }, { id: '69c27c4a07b053d458c6fec363e66403', board: '23ae18d4d92f03a4faba5c8e2e04ab49', machineParts: '52fff1ebf0dfdce40beab5e2d39dd722' }, { id: 'bc0cd2a586c78b846a43622b6ea5c953', board: '057772381b5669948b32540d09f450d2', machineParts: 'f0fa3ba37105f0c47b3256c9b1a53029' }, { id: '35eed4273d90143b0926de4715bbc06e', board: '7f7934b263cb23040ade0147d14b39aa', machineParts: 'bdf456820020fe2479d8ead94758b8f1' }, { id: '84482a6a9ce96a746b992465f8766f03', board: 'db23d828345b6744485ee266629dfe9d', machineParts: '12c12df71c09fde4e83eba1917733b4a' }, { id: 'b07ea9f765b04a7ab9767184611d7dfe', board: '30b17e1fb1d57fa4d9a3f52459c077d2', machineParts: '321127c0b723f2b4dab542736a42d31a' }, { id: '62fcd819e9801b541912cf5e45672c0b', board: '86141674efcedb74f8790919d22cabb5', machineParts: '584bfcc87c1ecc246b1ccbaae30a3b9a' }, { id: 'cbae9a210d638ba4b9402e836c970fa2', board: 'd556e5a451785514a95d4ccb15638366', machineParts: '8f39027f43a2f0e4a9ac3cdf6cfb86e9' }, { id: 'f8db3418b6542874396d1eaa52946e19', board: 'a4b60ac0a29864b4c9bb7e2dea51b153', machineParts: '8a8e8fdbc28227f4c952f82975586ff5' }, { id: 'a223c02f818b8d74abd3e94371d523d4', board: '78caa60e5ab06b34abfae4aa8c2e0396', machineParts: '4394c26a74214e64da4d9683de90400b' }, { id: '33b1458fce9cd5640bd6ca12f71ea32d', board: 'c1006dd833b24694bbff470825fdf980', machineParts: 'efb3910d71ee6fa4d9021b0ff331610c' }, { id: 'f85ab7ac2e81eeb48827c7b08a12b01e', board: '5d4ca840d60cf294f9d681a372052569', machineParts: 'c761eccc2206b4f45828e4c0a939e29d' }, { id: '9d444ad6dde436d44920ac030fc733de', board: 'ad4815304c0789c42ac14447f35f807f', machineParts: 'a27f80a1ee4a1484689b6f639504b40f' }, { id: 'b69bfc56f39849d4ba9139d2d51bedb6', board: 'ebb08cf966efc084aa918bd8d9429604', machineParts: 'c4c22bdc7cdd546479ac1de5589b5617' }, { id: '4a32182faa84141468acfc04b06fbdbc', board: '27fc1b3085c201f49914af0105be9480', machineParts: '2f6f01c41ec0f4841aa63519acc366ef' }, { id: 'e6c98fe5d50ad498cb91c461bc91d1ef', board: '837c89c8d01f2f1448f8d9eab06080dd', machineParts: '3e13e554e4a9a77488f9c82a22ec05a5' }, { id: '9c5034631fb1d4cb584c2cfaaa51f002', board: '7f7805d52e758bf479a255d76f54ff50', machineParts: '25014649d23fb71429c426ef1e570398' }, { id: '95c5b5155e1770c498b8e3214c75380d', board: 'cc328d3a4e0921542bcfe7e7d2310265', machineParts: '069efa97d253fe043a4821b52bcb3b05' }, { id: '4b507075734384867b1301bdbed10e81', board: '35aff5c4f96600c4a84b436e8d5850e1', machineParts: 'fec4a4b748d32e042aedd19dde005ee2' }, { id: 'fd4934673e01e4d4589f918670c3f4aa', board: 'a565b378d835ddf478bee7e52e6b95dd', machineParts: 'd7b92dbb9bdd1c543a43dbc82c7fdc57' }, { id: 'e947d751522b07a4186cd276fb16eefe', board: '85745799887db29418a4ddc4fe68d535', machineParts: 'cef0acf9fcd0bf340ab79662a60de428' }, { id: '1545df6d7741341319449e2f68bd1717', board: '23d78abe2740d804ca053640b8d7d10e', machineParts: '441a624c541ebf04c922208813d3d85d' }, { id: 'f311cd1480c254d34ba697cf2b5fad35', board: 'c7e51a61178506a45beecd9ba7c14e66', machineParts: 'e78c098489bf49e41823a9996cf9574b' }];

  const scripts = await crawlScripts();

  Object.values(scripts).forEach(script => {
    const file = prefabs[script.machineId]?.file;
    if (file !== undefined) {
      const machinePrefab = utils.fileToObject(file)[0];
      const boardId = machinePrefab.rawText
        .split('machineBoardPrefab')[1]
        ?.split('guid: ')[1]
        ?.split(',')[0]
        ?.trim();

      script.boardName = prefabs[boardId]?.name;
      script.boardImage = prefabs[boardId]?.spritePng;

      //      console.log('machine ', script.machineName, ' has a board ', script.boardName);
    } else {
      //      console.log('no prefab found for ', script.machineId);
    }
  });

  // DEV FUNCTION. LIST THE INVALID MACHINES
  const scriptIsInvalid = (script) => {
    return (script.boardImage === undefined ||
      script.boardName === undefined ||
      script.machineSprite === undefined ||
      script.partsAreValid === false);
  };

  fs.mkdir('machines', () => {});
  fs.mkdir('machines/images', () => {});

  let finalText = '| Machine | Parts |\r\n';
  finalText += '| --- | --- |\r\n';

  Object.values(scripts).forEach(script => {
    if (!scriptIsInvalid(script)) {
      //      console.log('------------ valid ', script.machineName);
      const machinePng = path.basename(script.machineSprite);
      fs.copyFile(script.machineSprite, `machines/images/${path.basename(script.machineSprite)}`, (err) => {});
      finalText += `| ${script.machineName} <br/> ![${script.machineName}](${machinePng}) |`;
      finalText += 'MACHINE BASE HARDCODED! <br/> ';
      finalText += `1 ${script.boardName} ![${script.boardName}](${path.basename(script.boardImage)}) <br/> `;
      fs.copyFile(script.boardImage, `machines/images/${path.basename(script.boardImage)}`, (err) => {});
      script.machineParts.forEach(part => {
        // let partPng = path.basename(textur)
        const partPng = path.basename(prefabs[part.id].spritePng);
        finalText += `${part.amount} ${part.name} ![${part.name}](${partPng}) <br/>`;
        fs.copyFile(prefabs[part.id].spritePng, `machines/images/${partPng}`, (err) => {});
      });
      finalText += ' | \r\n ';
    } else {
      console.log('invalid ', script);
    }
  });

  if (fs.existsSync('machines/machines.txt')) fs.unlinkSync('machines/machines.txt');
  fs.writeFile('machines/machines.txt', finalText, () => {});

  // machines.forEach(machine => {
  //   console.log(prefabs[machine.id]?.name);
  //   console.log(prefabs[machine.board]?.name);
  //   console.log('partsId', machine.machineParts);
  //   console.log('---');
  // });
};

init();
