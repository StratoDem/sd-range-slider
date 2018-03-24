// @flow

import React from 'react';
import { omit } from 'ramda';
import { Range } from 'rc-slider';

import format from 'string-format';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


type T_STYLE_OBJ = {style: Object, label: string};

type Props = {
  /** Component ID */
  id: string,
  /** Value used to select the slider */
  value: Array<number>,
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
  allowCross?: boolean,
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
  /** Text to display when no values are selected, e.g., 'any age' */
  noValuesText?: string,
  /** Formatter to use which takes min and max value */
  rangeFormatter?: string,
  /** Or higher string formatter */
  orHigherFormatter?: string,
  /** Or less string formatter */
  orLowerFormatter?: string,
  /** All values formatter */
  allValuesFormatter?: string,
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
  /** Is the variable categorical? Use checkboxes instead then */
  isCategorical?: boolean,
  /**
   * Dash-assigned callback that should be called whenever any of the
   * properties change
   */
  setProps?: (props: Object) => void,
}

type State = {
  value: Array<string | number>,
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
  isCategorical: false,
  allowCross: true,
  allValuesFormatter: '',
  noValuesText: '',
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
    this.state = {
      value: props.isCategorical ? Array.from(new Set(props.value)) : props.value,
      editorOpen: false,
    };
  }

  componentWillReceiveProps(nextProps: Props): void {
    this.setState({
      value: nextProps.isCategorical ? Array.from(new Set(nextProps.value)) : nextProps.value,
    });
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

  get compressedLabelCategorical(): string {
    const { value } = this.state;
    const valuesSorted = value.slice().sort();

    // Selected the entire range
    if (value.length === Object.keys(this.props.marks).length)
      return this.props.allValuesText;
    else if (value.length === 0)
      return this.props.noValuesText;

    return valuesSorted.map(v => this.props.marks[v].label).join(', ');
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

  get rangeComponent() {
    const { isCategorical, fireEvent, setProps, updatemode } = this.props;
    const { value } = this.state;

    return isCategorical
      ? (
        <div>
          {
            Object.keys(this.props.marks).map((val: number) => {
              const markValue = parseInt(String(val));

              return (
                <Checkbox
                  label={this.props.marks[markValue].label}
                  checked={value.indexOf(markValue) >= 0}
                  onCheck={() => {
                    const idxValue = value.indexOf(markValue);
                    const valueCopy = value.slice();

                    if (idxValue >= 0)
                      valueCopy.splice(idxValue, 1);
                    else
                      valueCopy.push(markValue);
                    this.setState({value: valueCopy});
                    if (setProps) setProps({value: valueCopy});
                    if (fireEvent) fireEvent('change');
                  }}
                />)
            })
          }
        </div>)
      :(
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
      />)
  }

  render() {
    const { isCategorical, buttonClassName, humanName, description } = this.props;

    const actions = [
      <FlatButton
        label="Done editing range"
        primary={true}
        onClick={() => { this.setState({editorOpen: false}); }}
      />
    ];

    const compressedLabel = isCategorical ? this.compressedLabelCategorical : this.compressedLabel;

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
              {this.rangeComponent}
            </div>
          </Dialog>
        </div>
        </MuiThemeProvider>);
  }
}

SDRangeSlider.defaultProps = defaultProps;
