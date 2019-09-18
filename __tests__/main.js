import {mount} from '@vue/test-utils';
import datetime from '../src/datetime_picker';

const testDate = '2018-04-07 14:12:00';

describe('DatetimePicker', () => {
    it('should render successfully',  () => {
        const comp = mount(datetime, {
            propsData: {
                value: testDate
            }
        });
        const input = comp.find('input');
        expect(input.exists()).toBeTruthy();
        expect(input.element.value).toBe(testDate);
    });

    it('hides the calendar initially', () => {
        const comp = mount(datetime, {
            propsData: {
                value: testDate
            }
        });
        let calendar = comp.find('.calender-div');
        expect(calendar.exists()).toBeTruthy();
        expect(calendar.element.classList).toContain('noDisplay');

        // Focussing the input should make it visible
        comp.find('input').trigger('click');
        calendar = comp.find('.calender-div');
        expect(calendar.element.classList).not.toContain('noDisplay');
    });

    describe('24h support', () => {
        it('should hide the period if the date format has H as hours field', () => {
            const comp12h = mount(datetime, {
                propsData: {
                    value: testDate,
                    format: 'YYYY-MM-DD h:i:s'
                }
            });
            const comp24h = mount(datetime, {
                propsData: {
                    value: testDate,
                    format: 'YYYY-MM-DD H:i:s'
                }
            });
            comp12h.find('input').trigger('click');
            let calendar = comp12h.findAll('.calender-div .minute-selector').wrappers[1].html();
            expect(calendar).toContain('PM');
    
            comp24h.find('input').trigger('click');
            const minuteSelectors = comp24h.findAll('.calender-div .minute-selector');
            expect(minuteSelectors.length).toBe(1);
        });

        it('should show 24 hours of options if the format has H as hours field', () => {
            const comp12h = mount(datetime, {
                propsData: {
                    value: testDate,
                    format: 'YYYY-MM-DD h:i:s'
                }
            });
            const comp24h = mount(datetime, {
                propsData: {
                    value: testDate,
                    format: 'YYYY-MM-DD H:i:s'
                }
            });

            comp12h.find('input').trigger('click');
            let hours = comp12h.findAll('.calender-div .hour-selector li');
            expect(hours.length).toBe(12);

            comp24h.find('input').trigger('click');
            hours = comp24h.findAll('.calender-div .hour-selector li');
            expect(hours.length).toBe(24);

            // In 24h mode the first option should be 00 and the last 23:
            expect(hours.wrappers[0].text()).toBe('00');
            expect(hours.wrappers[23].text()).toBe('23');

            hours.wrappers[0].trigger('click');
            comp24h.find('.ok').trigger('click');
            expect(comp24h.find('input').element.value).toBe('2018-04-07 00:12:00');

            comp24h.find('input').trigger('click');
            hours.wrappers[23].trigger('click');
            comp24h.find('.ok').trigger('click');
            expect(comp24h.find('input').element.value).toBe('2018-04-07 23:12:00');
        });

        it('should ommit seconds from output if format doesnt have :s field', () => {
            const comp12h = mount(datetime, {
                propsData: {
                    value: testDate,
                    format: 'YYYY-MM-DD h:i'
                }
            });
            const comp24h = mount(datetime, {
                propsData: {
                    value: testDate,
                    format: 'YYYY-MM-DD H:i'
                }
            });

            comp12h.find('input').trigger('click');
            let hours = comp12h.findAll('.calender-div .hour-selector li');
            hours.wrappers[0].trigger('click');
            comp12h.find('.ok').trigger('click');
            expect(comp12h.find('input').element.value).toBe('2018-04-07 13:12');

            comp12h.find('input[type="text"]').trigger('click');
            hours.wrappers[10].trigger('click');
            comp12h.find('.ok').trigger('click');
            expect(comp12h.find('input[type="text"]').element.value).toBe('2018-04-07 23:12');


            comp24h.find('input').trigger('click');
            hours = comp24h.findAll('.calender-div .hour-selector li');

            hours.wrappers[0].trigger('click');
            comp24h.find('.ok').trigger('click');
            expect(comp24h.find('input').element.value).toBe('2018-04-07 00:12');

            comp24h.find('input[type="text"]').trigger('click');
            hours.wrappers[23].trigger('click');
            comp24h.find('.ok').trigger('click');
            expect(comp24h.find('input[type="text"]').element.value).toBe('2018-04-07 23:12');
        });
    });
});
