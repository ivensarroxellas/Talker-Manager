const { readFile, writeFile } = require('fs').promises;
const { resolve } = require('path');
const crypto = require('crypto');

const PATH = 'talker.json';

const getAllTalkers = async () => {
  const response = await readFile(resolve(__dirname, PATH), 'utf8');
  const talkers = JSON.parse(response);
  return talkers;
};

const getOneTalker = async (id) => {
  const response = await readFile(resolve(__dirname, PATH), 'utf8');
  const talker = JSON.parse(response).find((item) => +item.id === +id);
  return talker;
};

const getToken = async () => {
  const result = { token: crypto.randomBytes(8).toString('hex') };
  return result;
};

const addTalker = async (talker) => {
  const oldTalkers = await getAllTalkers(); 
  
  const takeNewId = oldTalkers[oldTalkers.length - 1].id + 1;
  const addNewTalker = { id: takeNewId, ...talker };
  const newTalkerData = [...oldTalkers, addNewTalker];
  const newJSON = JSON.stringify(newTalkerData, null, 2);
  await writeFile(resolve(__dirname, PATH), newJSON);
  return newTalkerData[newTalkerData.length - 1];
};

const editTalker = async (id, body) => {
  const talkers = await getAllTalkers();
  const talkersIndex = talkers.findIndex((talker) => Number(talker.id) === Number(id));
  talkers[talkersIndex] = {
    id: Number(id),
    ...body,
  };
  const newTalkerJSON = JSON.stringify(talkers, null, 2);
  await writeFile(resolve(__dirname, PATH), newTalkerJSON);
  return talkers[talkersIndex];
};

const deleteTalker = async (id) => {
  const talkers = await getAllTalkers();
  const talkerFilter = talkers.filter((element) => Number(element.id) !== Number(id));
  const newJSON = JSON.stringify(talkerFilter, null, 2);
  await writeFile(resolve(__dirname, PATH), newJSON);
  return talkerFilter;
};

module.exports = {
  getAllTalkers,
  getOneTalker,
  getToken,
  addTalker,
  editTalker,
  deleteTalker,
};