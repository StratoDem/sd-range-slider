import React from 'react';
import {shallow} from 'enzyme';
import Checkbox from 'material-ui/Checkbox'
import SDRangeSlider from '../SDRangeSlider.react';

describe('SDRangeSlider', () => {

    it('renders', () => {
        const component = shallow(
          <SDRangeSlider
            label="Test label"
            value={[1, 3]}
            marks={{
                1: {label: 'v1 to v2'},
                2: {label: 'v3 to v4'},
                3: {label: 'v5 to v6'},
                4: {label: 'v7 to v8'}
            }}
          />);
        expect(component).toBe.ok;
    });

    it('uses categorical', () => {
        const component = shallow(
          <SDRangeSlider
            label="Test label"
            value={[1, 3]}
            marks={{
                1: {label: 'v1 to v2'},
                2: {label: 'v3 to v4'},
                3: {label: 'v5 to v6'},
                4: {label: 'v7 to v8'}
            }}
            isCategorical={true}
          />);
        expect(component.find(Checkbox).length).toBe(4);
    });
});
