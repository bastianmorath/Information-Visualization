import pandas as pd

# This skript unstacks the file, such that we have a country and a year as each "row id", 
# instead of having each separate year as a separate column
df = pd.read_excel('gdp_per_capita_curr_dollar.xls')

df = df.set_index('Country Code').unstack().reset_index()
df.columns = ['Year','Country Code','GDP']

df.sort_values(by=['Country Code', 'Year'], inplace=True)
df.reset_index(inplace=True)
del df['index']

df.to_csv('converted_gdp_per_capita.csv', sep='\t')

