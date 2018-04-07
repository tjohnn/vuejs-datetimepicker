import {mount} from '@vue/test-utils';
import datetime from '../src/datetime_picker';

describe('DatetimePicker', () => {
    it('should render successfully',  () => {
        mount(datetime, {});
    });
});
