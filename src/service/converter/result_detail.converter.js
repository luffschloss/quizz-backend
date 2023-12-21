module.exports = {
    convertDataToModel: (model, dto) => {
        model.test_id = dto.test_id;
        model.question_id = dto.question_id;
        model.choose = dto.choose;
        return model;
    }
}