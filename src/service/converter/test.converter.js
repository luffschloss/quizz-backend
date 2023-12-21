module.exports = {
    convertDataToModel: (model, dto) => {
        model.name = dto.name;
        model.password = dto.password;
        model.start_time = dto.start_time;
        model.schedule_time = dto.schedule_time;
        model.end_time = dto.end_time;
        model.easy_question = dto.easy_question;
        model.medium_question = dto.medium_question;
        model.difficult_question = dto.difficult_question;
        model.show_correct_answer = dto.show_correct_answer;
        model.show_mark = dto.show_mark;
        model.submit_when_switch_tab = dto.submit_when_switch_tab;
        model.user_id = dto.user_id;
        model.subject_id = dto.subject_id;
        return model;
    }
}