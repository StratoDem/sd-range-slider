import sd_range_slider
import dash
import dash_html_components as html

app = dash.Dash('')

app.scripts.config.serve_locally = True

app.layout = html.Div([

    # Test normal use case
    html.Div(
        sd_range_slider.SDRangeSlider(
            id='input',
            value=[1, 3],
            marks={val: {'label': label, 'style': {'font-size': '80%'}}
                   for val, label in [
                       (1, 'Under 25'),
                       (2, '25 to 34'),
                       (3, '35 to 44'),
                       (4, '45+')]},
            minVal=1,
            maxVal=4,
            orHigherFormatter='{} or older',
            orLowerFormatter='Under {} years old',
            rangeFormatter='{} to {} years old',
            allValuesText='All ages',
            humanName='Age cohort',
            description='Test description magic',
            singleValueFormatting=False)
    ),
    html.Div(id='output'),

    # Test categorical use case
    html.Div(
        sd_range_slider.SDRangeSlider(
            id='input-categorical',
            isCategorical=True,
            value=[1, 3],
            marks={val: {'label': label, 'style': {'font-size': '80%'}}
                   for val, label in [
                       (1, 'Under 25'),
                       (2, '25 to 34'),
                       (3, '35 to 44'),
                       (4, '45+')]},
            minVal=1,
            maxVal=4,
            orHigherFormatter='{} or older',
            orLowerFormatter='Under {} years old',
            rangeFormatter='{} to {} years old',
            allValuesText='All ages',
            noValuesText='Any age',
            humanName='Age cohort',
            description='Test description magic',
            singleValueFormatting=False,
        )
    ),
    html.Div(id='output-categorical'),

    # Test restricted lower range
    html.Div(
        sd_range_slider.SDRangeSlider(
            id='input-restricted-lower',
            value=[2, 3],
            marks={val: {'label': label, 'style': {'font-size': '80%'}}
                   for val, label in [
                       (2, '25 to 34'),
                       (3, '35 to 44'),
                       (4, '45+')]},
            minVal=2,
            maxVal=4,
            orHigherFormatter='{} or older',
            orLowerFormatter='Under {} years old',
            rangeFormatter='{} to {} years old',
            allValuesText='All ages',
            restrictedLower=True,
            humanName='Age cohort',
            description='Test description magic',
            singleValueFormatting=False)
    ),
    html.Div(id='output-restricted-lower'),

    # Test restricted higher range
    html.Div(
        sd_range_slider.SDRangeSlider(
            id='input-restricted-higher',
            value=[1, 3],
            marks={val: {'label': label, 'style': {'font-size': '80%'}}
                   for val, label in [
                       (1, 'Under 25'),
                       (2, '25 to 34'),
                       (3, '35 to 44')]},
            minVal=1,
            maxVal=3,
            orHigherFormatter='{} or older',
            orLowerFormatter='Under {} years old',
            rangeFormatter='{} to {} years old',
            allValuesText='All ages',
            restrictedHigher=True,
            humanName='Age cohort',
            description='Test description magic',
            singleValueFormatting=False)
    ),
    html.Div(id='output-restricted-higher'),

    # Test restricted lower and higher
    html.Div(
        sd_range_slider.SDRangeSlider(
            id='input-restricted-all',
            value=[2, 3],
            marks={val: {'label': label, 'style': {'font-size': '80%'}}
                   for val, label in [
                       (2, '25 to 34'),
                       (3, '35 to 44'),
                       (4, '45 to 49'),
                       (5, '50 to 54')]},
            minVal=2,
            maxVal=5,
            orHigherFormatter='{} or older',
            orLowerFormatter='Under {} years old',
            rangeFormatter='{} to {} years old',
            allValuesText='All ages',
            restrictedHigher=True,
            restrictedLower=True,
            humanName='Age cohort',
            description='Test description magic',
            singleValueFormatting=False)
    ),
    html.Div(id='output-restricted-all'),

    # Test update on close
    html.Div(
        sd_range_slider.SDRangeSlider(
            id='input-update-on-close',
            value=[2, 3],
            marks={val: {'label': label, 'style': {'font-size': '80%'}}
                   for val, label in [
                       (2, '25 to 34'),
                       (3, '35 to 44'),
                       (4, '45 to 49'),
                       (5, '50 to 54')]},
            minVal=2,
            maxVal=5,
            updatemode='modalClose',
            orHigherFormatter='{} or older',
            orLowerFormatter='Under {} years old',
            rangeFormatter='{} to {} years old',
            allValuesText='All ages',
            restrictedHigher=True,
            restrictedLower=True,
            humanName='Age cohort',
            description='Test description magic',
            singleValueFormatting=False)
    ),
    html.Div(id='output-update-on-close'),

], style=dict(width=250))


@app.callback(
    dash.dependencies.Output('output', 'children'),
    [dash.dependencies.Input('input', 'value')])
def display_output(value):
    return 'You have entered {}'.format(value)


@app.callback(
    dash.dependencies.Output('output-categorical', 'children'),
    [dash.dependencies.Input('input-categorical', 'value')])
def display_output(value):
    return 'You have entered {}'.format(value)


@app.callback(
    dash.dependencies.Output('output-restricted-lower', 'children'),
    [dash.dependencies.Input('input-restricted-lower', 'value')])
def display_output(value):
    return 'Restricted lower - You have entered {}'.format(value)


@app.callback(
    dash.dependencies.Output('output-restricted-higher', 'children'),
    [dash.dependencies.Input('input-restricted-higher', 'value')])
def display_output(value):
    return 'Restricted higher - You have entered {}'.format(value)


@app.callback(
    dash.dependencies.Output('output-restricted-all', 'children'),
    [dash.dependencies.Input('input-restricted-all', 'value')])
def display_output(value):
    return 'Restricted lower and higher - You have entered {}'.format(value)


@app.callback(
    dash.dependencies.Output('output-update-on-close', 'children'),
    [dash.dependencies.Input('input-update-on-close', 'value')])
def display_output(value):
    return 'Update on close - You have entered {}'.format(value)


if __name__ == '__main__':
    app.run_server(debug=True)
