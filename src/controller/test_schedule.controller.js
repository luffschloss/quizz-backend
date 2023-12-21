const express = require('express');
const testScheduleService = require('../service/test_schedule.service');
const router = express.Router();

router.get('/', async (req, res) => {
    res.send(await testScheduleService.getAll());
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    res.send(await testScheduleService.getOne(id));
});

router.post('/', async (req, res) => {
    const test_schedule = req.body;
    res.send(await testScheduleService.create(test_schedule));
});

router.put('/', async (req, res) => {
    const test_schedule = req.body;
    res.send(await testScheduleService.update(test_schedule));
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    res.send(await testScheduleService.delete(id));
});

module.exports = router;