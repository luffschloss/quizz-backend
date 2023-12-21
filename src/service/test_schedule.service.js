const testScheduleRepository = require('../repository/test_schedule.repository');
const BaseAPIResponse = require('../dto/baseApiResponse');
const { CONFIG } = require('../shared/common.constants');
const { Helpers, logger } = require('../extension/helper');
const testScheduleConverter = require('./converter/test_schedule.converter');

module.exports = {
    getAll: async () => {
        try {
            var data = await testScheduleRepository.getAll();
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.SUCCESS, data, null);
        }
        catch (err) {
            logger.error('get all test_schedule failed!');
            console.log(err);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.ERROR, null, err.message);
        }
    },
    getOne: async (id) => {
        try {
            var data = await testScheduleRepository.getById(id);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.SUCCESS, data, null);
        }
        catch (err) {
            logger.error(`get test_schedule with id "${id}" failed`);
            console.log(err);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.ERROR, null, err.message);
        }
    },
    create: async (test_schedule) => {
        try {
            let data = await testScheduleRepository.create(test_schedule);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.SUCCESS, data, null);
        }
        catch (err) {
            logger.error('create test_schedule failed');
            console.log(err);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.ERROR, null, err.message);
        }
    },
    update: async (test_schedule) => {
        try {
            let test_scheduleModel = await testScheduleRepository.getById(test_schedule.id);
            if (!test_scheduleModel) {
                throw new Error('Đề thi không tồn tại');
            }
            testScheduleConverter.convertDataToModel(test_scheduleModel, test_schedule);
            var data = await testScheduleRepository.update(test_scheduleModel);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.SUCCESS, data, null);
        }
        catch (err) {
            logger.error(`update test_schedule failed`);
            console.log(err);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.ERROR, null, err.message);
        }
    },
    delete: async (id) => {
        try {
            let test_scheduleModel = await testScheduleRepository.getById(id);
            if (!test_scheduleModel) {
                throw new Error('Đề thi không tồn tại');
            }
            var data = await testScheduleRepository.delete(id);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.SUCCESS, data, null);
        }
        catch (err) {
            logger.error(`delete test_schedule with id ${id} failed`);
            console.log(err);
            return new BaseAPIResponse(CONFIG.RESPONSE_STATUS_CODE.ERROR, null, err.message);
        }
    },
    /**/
    createtest_scheduleGroup: async () => {

    },
    updatetest_scheduleGroup: async () => {

    },
    deletetest_scheduleGroup: async () => {

    },

    /**/
    createtest_scheduleQuestion: async () => {

    },
    updatetest_scheduleQuestion: async () => {

    },
    deletetest_scheduleQuestion: async () => {

    }
}