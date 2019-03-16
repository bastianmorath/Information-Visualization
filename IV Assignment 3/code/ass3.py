import json
import pandas as pd
from pandas.io.json import json_normalize

filename = '../data/s2-corpus-00.json'
# filename = '../data/s2-corpus-00_full.json'

data = []
content = open(filename, "r").read() 
f = json.loads("[" + content.replace("}\n{", "},\n{") + "]")

df_original = json_normalize(f)


# Top 5 cited papers:

df_original['number_in_citations'] = df_original.apply (lambda row: len(row['inCitations']), axis=1)
print('Top 5 cited papers at ArXiv: ')
print(df_original[df_original['venue']=='ArXiv'].sort_values(by='number_in_citations', ascending=False)[['title', 'number_in_citations']].head(10))

# Years of ICSE papers:

print('Years of ICSE papers: ')
df_public_ICSE = df_original[df_original['venue'] == 'ICSE']
print(df_public_ICSE['year'])

'''
column_names = list(df_original) + ['author']
del column_names[0]
df = pd.DataFrame(columns=column_names)

for index, _ in df_original.iterrows():
	row = df_original.loc[index, :].copy(deep=True)
	authors = row['authors']
	del row['authors']
	for dict in authors:
		row['author'] = dict['name']
		df = df.append(row)

df.reset_index(inplace=True)
'''

from dataclasses import dataclass

@dataclass
class ContributorIndex():


	years_active: float = 1.0
	number_of_papers: float = 0.0
	total_in_citations: float = 0.0
	name: str = ''

	@property
	def index(self):
		return 1 / (self.number_of_papers + self.years_active + self.total_in_citations)

contrib_list = []


def filter_row(row, name):
	for a in row['authors']:
		if (a['name'] == name):
			return True
	return False

df_copy = df_original.copy(deep=True)
for index, _ in df_original.iterrows():
	row = df_copy.loc[index, :]
	if len(row['authors']) != 0:
		name = row['authors'][0]['name']
		name_df = df_copy[df_copy.apply(lambda x: True in [a['name'] == name for a in x['authors']], axis=1)]
		indices = name_df.index.tolist()
		for ind in indices:
			author_list = df_copy.loc[ind]['authors']
			if len(author_list) == 0: # No authors left
				df_copy.drop(df_copy.index[ind]) # Drop row
			else:
				df_copy.at[ind, 'authors'] = [a for a in author_list if a['name'] != name]
		contrib_index = ContributorIndex()
		contrib_index.name = name
		contrib_index.years_active =  name_df.sort_values(by='year', ascending=False).iloc[0]['year'] - name_df.sort_values(by='year', ascending=False).iloc[-1]['year'] + 1
		contrib_index.total_in_citations = name_df['number_in_citations'].sum()
		contrib_index.number_of_papers = len(name_df.index)

		contrib_list.append(contrib_index)

for ci in contrib_list:
	print(ci)
	print(ci.index)