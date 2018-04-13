import {mount} from '@vue/test-utils';
import datetime from '../src/datetime_picker';

const testDate = '2018-04-07 14:12:00';

describe('First day of week', () => {
    it('should be set to Sunday using the number 0',  () => {
        const comp = mount(datetime, {
            propsData: {
                value: testDate,
                firstDayOfWeek: 0
            }
        });
        const input = comp.find('input');
        input.trigger('click');
        const dayHeaders = comp.findAll('.calender-div .headers .days').wrappers.map(el => el.text());
        expect(dayHeaders).toHaveLength(7);
        expect(dayHeaders).toEqual(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']);

        // In the test-month, the first day is a Sunday. So, we should get
        // a complete first week in the first row.
        const firstWeek = comp.findAll('.calender-div .week').wrappers[0];
        const days = firstWeek.findAll('.port').wrappers.map(day => day.text().trim());
        expect(days).toEqual(['01', '02', '03', '04', '05', '06', '07']);
    });

    it('should be set to Monday using the number 1',  () => {
        const comp = mount(datetime, {
            propsData: {
                value: testDate,
                firstDayOfWeek: 1
            }
        });
        const input = comp.find('input');
        input.trigger('click');
        const dayHeaders = comp.findAll('.calender-div .headers .days').wrappers.map(el => el.text());
        expect(dayHeaders).toHaveLength(7);
        expect(dayHeaders).toEqual(['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']);

        // In the test-month, the first day is a Sunday. So, we should get
        // 6 empty slots in the first week.
        const firstWeek = comp.findAll('.calender-div .week').wrappers[0];
        const days = firstWeek.findAll('.port').wrappers.map(day => day.text().trim());
        expect(days).toEqual(['', '', '', '', '', '', '01']);
    });
});
