"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Calendar = exports.CalendarType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
var CalendarType;
(function (CalendarType) {
    CalendarType["BUSY"] = "BUSY";
    CalendarType["AVAILABLE"] = "AVAILABLE";
})(CalendarType || (exports.CalendarType = CalendarType = {}));
@(0, typeorm_1.Entity)('calendars')
class Calendar {
    @(0, typeorm_1.PrimaryGeneratedColumn)()
    id;
    @(0, typeorm_1.ManyToOne)(() => user_entity_1.User)
    user;
    @(0, typeorm_1.Column)()
    startTime;
    @(0, typeorm_1.Column)()
    endTime;
    @(0, typeorm_1.Column)({
        type: 'enum',
        enum: CalendarType,
        default: CalendarType.AVAILABLE,
    })
    type;
    @(0, typeorm_1.Column)({ nullable: true })
    description;
    @(0, typeorm_1.CreateDateColumn)()
    createdAt;
    @(0, typeorm_1.UpdateDateColumn)()
    updatedAt;
}
exports.Calendar = Calendar;
//# sourceMappingURL=calendar.entity.js.map