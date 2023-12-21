module.exports = {
    convertDataToModel: (model, dto) => {
        model.test_group_id = dto.test_group_id;
        model.user_id = dto.user_id;
        model.mark = dto.mark;
        model.start_time = dto.start_time;
        model.end_time = dto.end_time;
        model.tab_switch = dto.tab_switch;
        return model;
    }
}