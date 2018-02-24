// @flow

import React from 'react';
import { omit } from 'ramda';
import { Range } from 'rc-slider';

import format from 'string-format';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


type T_STYLE_OBJ = {style: Object, label: string};

type Props = {
  /** Component ID */
  id: string,
  /** Value used to select the slider */
  value: Array<number | string>,
  /**
   * Marks on the slider.
   * The key determines the position,
   * and the value determines what will show.
   * If you want to set the style of a specific mark point,
   * the value should be an object which
   * contains style and label properties.
   */
  marks: {
    /** Label for the mark */
    number: string | T_STYLE_OBJ,
  },
  /** Set allowCross to true to allow handles to cross */
  allowCross: boolean,
  /** Variable is strictly ascending? */
  ascending?: boolean,
  /** Minimum value for the slider */
  minVal: string | number,
  /** Maximum value for the slider */
  maxVal: string | number,
  /** Human-readable name of the variable to display */
  humanName: string,
  /** Description of the variable to display in the Dialog */
  description: string,
  /** Text to display when all values are selected, e.g., 'all ages' */
  allValuesText: string,
  /** Formatter to use which takes min and max value */
  rangeFormatter?: string,
  /** Or higher string formatter */
  orHigherFormatter?: string,
  /** Or less string formatter */
  orLowerFormatter?: string,
  /** All values formatter */
  allValuesFormatter: string,
  /** Should the range slider try to split the label strings intelligently? */
  splitLabels?: boolean,
  /** Should the range slider apply "{} to {}"-style formatting to the label is a single
   * value is selected? */
  singleValueFormatting?: boolean,
  /**
     * Determines when the component should update
     * its value. If `mouseup`, then the slider
     * will only trigger its value when the user has
     * finished dragging the slider. If `drag`, then
     * the slider will update its value continuously
     * as it is being dragged.
     * Only use `drag` if your updates are fast.
     */
  updatemode?: 'mouseup' | 'drag',
  /** Class name to apply to the button */
  buttonClassName?: string,
  /**
   * Dash-assigned callback that should be called whenever any of the
   * properties change
   */
  setProps?: (props: Object) => void,
}

type State = {
  value: string | number,
  editorOpen: boolean,
}

const defaultProps = {
  ascending: true,
  updatemode: 'mouseup',
  rangeFormatter: '{} to {}',
  orLowerFormatter: 'Under {}',
  orHigherFormatter: '{} or higher',
  buttonClassName: '',
  splitLabels: true,
  singleValueFormatting: true,
};


/**
 * SDRangeSlider is an example component.
 * It takes a property, `label`, and
 * displays it.
 * It renders an input with the property `value`
 * which is editable by the user.
 */
export default class SDRangeSlider extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {value: props.value, editorOpen: false};
  }

  componentWillReceiveProps(newProps: Props): void {
    this.setState({value: newProps.value});
  }

  splitLabel(label: string, index: number): string {
    const { splitLabels } = this.props;

    if (splitLabels) {
      const vals = label.split(' ');
      if (index < 0)
        return vals[vals.length + index];
      return vals[index];
    }

    return label;
  }

  get compressedLabel(): string {
    const { value } = this.state;
    const lowValSelected = value[0];
    const highValSelected = value[1];

    const {
      marks,
      allValuesText,
      orHigherFormatter,
      orLowerFormatter,
      rangeFormatter,
      singleValueFormatting } = this.props;
    const values = Object.keys(marks);
    const minValue = Math.min(...values);
    const maxVal = Math.max(...values);

    // Selected the entire range
    if (minValue === lowValSelected && maxVal === highValSelected)
      return allValuesText;
    // We don't want to do anything special if only one value is selected
    else if (!singleValueFormatting && lowValSelected === highValSelected)
      return marks[lowValSelected].label;
    // This goes from the minimum possible value up to the highest value selected
    else if (minValue === lowValSelected)
      return format(orLowerFormatter, this.splitLabel(marks[highValSelected].label, -1));
    // This goes from the highest possible value down to the lowest value selected
    else if (maxVal === highValSelected)
      return format(orHigherFormatter, this.splitLabel(marks[lowValSelected].label, 0));

    const highStr = this.splitLabel(marks[highValSelected].label, -1);
    const lowStr = this.splitLabel(marks[lowValSelected].label, 0);

    return format(rangeFormatter, lowStr, highStr);
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
            <a
              href="#edit-slider"
              onClick={(event) => {
                event.preventDefault();
                this.setState({editorOpen: true});
              }}
              className="edit"
            >
              <span className="label-text">{compressedLabel}</span>
              <span className={buttonClassName} />
              <span className="edit-rarr">&rarr;</span>
            </a>
          </div>
          <Dialog
            title={typeof humanName === 'string'
              ? <h6>Edit range for <strong>{humanName}</strong></h6>
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
                style={{width: '82%', marginLeft: '9%', marginBottom: 20}}
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

SDRangeSlider.defaultProps = defaultProps;
