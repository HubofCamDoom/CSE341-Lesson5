const { response } = require('express');
const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

//MongoDB GET all
const getAll = async (req, res, next) => {
  const result = await mongodb.getDb().db().collection("data").find();
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  });
};

// MongoDB GET by ID
const getSingle = async (req, res, next) => {
  const unitId = new ObjectId(req.params.id);
  const result = await mongodb.getDb().db("Lesson5").collection("data").find({ _id: unitId });
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists[0]);
  });
};

// MongoDB POST controller
const addData = async (req, res, next) => {
  const unit = {
    unitName: req.body.unitName,
    unitCost: req.body.unitCost,
    unitType: req.body.unitType,
    upgrades: req.body.upgrades,
    unitSize: req.body.unitSize
  };
  const result = await mongodb.getDb().db().collection("data").insertOne(unit);
  if (result.acknowledged) {
    res.status(201).json(result);
  } else {
    res.status(500).json(result.error || 'ERROR: data failed creation.');
  }
};

// MongoDB PUT controller
const editData = async (req, res) => {
  const unitId = new ObjectId(req.params.id);
  const unit = {
    unitName: req.body.unitName,
    unitCost: req.body.unitCost,
    unitType: req.body.unitType,
    upgrades: req.body.upgrades,
    unitSize: req.body.unitSize
  };
  const result = await mongodb.getDb().db().collection("data").replaceOne({ _id: unitId }, unit);
  console.log(result);
  if (result.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(result.error || 'ERROR: data failed modification.');
  }
};

// MongoDB DELETE controller
const removeData = async (req, res) => {
  const unitId = new ObjectId(req.params.id);
  const result = await mongodb.getDb().db().collection("data").deleteOne({ _id: unitId }, true);
  console.log(result);
  if (result.deletedCount > 0) {
    res.status(200).send();
  } else {
    res.status(500).json(result.error || 'ERROR: data has resisted culling.');
  }
};

module.exports = { getAll, getSingle, addData, editData, removeData };