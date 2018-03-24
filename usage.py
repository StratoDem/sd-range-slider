import sd_range_slider
import dash
import dash_html_components as html

app = dash.Dash('')

app.scripts.config.serve_locally = True

app.layout = html.Div([
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
], style=dict(width=250))


@app.callback(
    dash.dependencies.Output('output', 'children'),
    [dash.dependencies.Input('input', 'value')])
def display_output(value):
    return 'You have entered {}'.format(value)


if __name__ == '__main__':
    app.run_server(debug=True)
