import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { omit } from 'ramda';
import { Range } from 'rc-slider';

import format from 'string-format';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


const propTypes = {
  /** The ID used to identify this component */
  id: PropTypes.string,

  /** The value used to select the slider */
  value: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),

  /**
   * Marks on the slider.
   * The key determines the position,
   * and the value determines what will show.
   * If you want to set the style of a specific mark point,
   * the value should be an object which
   * contains style and label properties.
   */
  marks: PropTypes.shape({
    number: PropTypes.oneOfType([
      /**
       * The label of the mark
       */
      PropTypes.string,

      /**
       * The style and label of the mark
       */
      PropTypes.shape({
        style: PropTypes.object,
        label: PropTypes.string
      })
    ])
  }),

  /**
   * allowCross could be set as true to allow those handles to cross.
   */
  allowCross: PropTypes.bool,

  /** Variable is strictly ascending? */
  ascending: PropTypes.bool,

  /** Minimum value for the slider */
  minVal: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

  /** Maximum value for the slider */
  maxVal: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

  /** Human-readable name of the variable to display */
  humanName: PropTypes.string,

  /** Description of the variable to display in the Dialog */
  description: PropTypes.string,

  /** Text to display when all values are selected, e.g. 'all ages' */
  allValuesText: PropTypes.string,

  /** Formatter to use which takes min and max value */
  rangeFormatter: PropTypes.string,

  /** Or higher string formatter */
  orHigherFormatter: PropTypes.string,

  /** Or less string formatter */
  orLowerFormatter: PropTypes.string,

  /** All values formatter */
  allValuesFormatter: PropTypes.string,

  /**
     * Determines when the component should update
     * its value. If `mouseup`, then the slider
     * will only trigger its value when the user has
     * finished dragging the slider. If `drag`, then
     * the slider will update its value continuously
     * as it is being dragged.
     * Only use `drag` if your updates are fast.
     */
    updatemode: PropTypes.oneOf(['mouseup', 'drag']),

  /** Class name to apply to the button */
  buttonClassName: PropTypes.string,

  /**
   * Dash-assigned callback that should be called whenever any of the
   * properties change
   */
  setProps: PropTypes.func
};

const defaultProps = {
  ascending: true,
  updatemode: 'mouseup',
  rangeFormatter: '{} to {}',
  orLowerFormatter: 'Under {}',
  orHigherFormatter: '{} or higher',
  buttonClassName: ''
};


/**
 * SDRangeSlider is an example component.
 * It takes a property, `label`, and
 * displays it.
 * It renders an input with the property `value`
 * which is editable by the user.
 */
export default class SDRangeSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {value: props.value, editorOpen: true};
  }

  componentWillReceiveProps(newProps) {
    this.setState({value: newProps.value});
  }

  get compressedLabel() {
    const { value } = this.state;
    // const [lowValSelected, highValSelected] = this.state.value;
    const lowValSelected = value[0];
    const highValSelected = value[1];

    const {
      marks,
      allValuesText,
      orHigherFormatter,
      orLowerFormatter,
      rangeFormatter} = this.props;
    const values = Object.keys(marks);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);

    if (minVal === lowValSelected && maxVal === highValSelected)
      return allValuesText;
    else if (minVal === lowValSelected) {
      const vals = marks[highValSelected].label.split(' ');
      const highStr = vals[vals.length - 1];
      return format(orLowerFormatter, highStr);
    } else if (maxVal === highValSelected) {
      const vals = marks[lowValSelected].label.split(' ');
      return format(orHigherFormatter, vals[0]);
    }
    const valsHigh = marks[highValSelected].label.split(' ');
    const highStr = valsHigh[valsHigh.length - 1];

    return format(
      rangeFormatter,
      marks[lowValSelected].label.split(' ')[0],
      highStr);
  }

  render() {
    const { fireEvent, setProps, updatemode, buttonClassName, humanName, description } = this.props;
    const { value } = this.state;

    const actions = [
      <FlatButton
        label="Done editing range"
        primary={true}
        onClick={() => { this.setState({editorOpen: false}); }}
      />
    ];

    const compressedLabel = this.compressedLabel;

    return (
      <MuiThemeProvider>
        <div className="sd-range-slider">
          <div className="compressed-label">
            {compressedLabel}
            <a
              href="#edit-slider"
              onClick={(event) => {
                event.preventDefault();
                this.setState({editorOpen: true});
              }}
              className="edit"
            >
              <span className={buttonClassName} />
              <span className="edit-rarr">&rarr;</span>
            </a>
          </div>
          <Dialog
            title={typeof humanName === 'string'
              ? <h6>Edit range for <strong>{humanName.toLowerCase()}</strong></h6>
              : <h6>Edit range</h6>}
            actions={actions}
            modal={false}
            open={this.state.editorOpen}
            onRequestClose={() => { this.setState({editorOpen: false}); }}
          >
            <div>
              <p>{description}</p>
              <p>Selected: <strong>{compressedLabel}</strong></p>
              <Range
                onChange={val => {
                  this.setState({value: val});
                  if (updatemode === 'drag') {
                    if (setProps) setProps({value: val});
                    if (fireEvent) fireEvent('change');
                  }
                }}
                style={{width: '82%', marginLeft: '9%'}}
                onAfterChange={val => {
                  if (updatemode === 'mouseup') {
                    if (setProps) setProps({value: val});
                    if (fireEvent) fireEvent('change');
                  }
                }}
                value={value}
                {...omit(
                  ['value', 'fireEvent', 'setProps', 'updatemode'],
                  {...this.props, min: this.props.minVal, max: this.props.maxVal})}
              />
            </div>
          </Dialog>
        </div>
        </MuiThemeProvider>);
  }
}

SDRangeSlider.propTypes = propTypes;
SDRangeSlider.defaultProps = defaultProps;
