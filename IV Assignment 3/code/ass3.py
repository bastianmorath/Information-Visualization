import json
import pandas as pd
from pandas.io.json import json_normalize

filename = '../data/s2-corpus-00.json'
# filename = '../data/s2-corpus-00_full.json'

data = []
content = open(filename, "r").read() 
f = json.loads("[" + content.replace("}\n{", "},\n{") + "]")

df_original = json_normalize(f)[['title', 'authors', 'inCitations', 'year', 'venue']]


column_names = list(df_original) + ['author']
del column_names[0]
df = pd.DataFrame(columns=column_names)

for index, _ in df_original.iterrows():
	row = df_original.loc[index, :].copy(deep=True)
	authors = row['authors']
	for dict in authors:
		row['author'] = dict['name']
		df = df.append(row)

df.reset_index(inplace=True)
df['inCitations'] = df['inCitations'].apply(lambda x: len(x))
df.drop(['authors'], axis=1, inplace=True)


# Top 5 cited papers:

print('Top 5 cited papers at ArXiv: ')
print(df_original[df_original['venue']=='ArXiv'].sort_values(by='inCitations', ascending=False)[['title', 'inCitations']].head(10))

# Years of ICSE papers:

print('Years of ICSE papers: ')
df_public_ICSE = df_original[df_original['venue'] == 'ICSE']
print(df_public_ICSE['year'])



from dataclasses import dataclass

@dataclass
class ContributorIndex():


	years_active: int = 1
	number_of_papers: int = 0
	total_in_citations: int = 0
	name: str = ''

	@property
	def index(self):
		return 1 / (self.number_of_papers + self.years_active + self.total_in_citations)

contrib_list = []


# df_copy = df_original.copy(deep=True)
authors_looked_at = []

for index, _ in df_original.iterrows():
	df_original.at[index, 'authors'] = [a['name'] for a in df_original.at[index, 'authors']]

	row = df_original.loc[index, :]
	for name in row['authors']:
		if not name in authors_looked_at:
			name_df = df_original[df_original.apply(lambda x: name in x['authors'], axis=1)].copy()
			contrib_index = ContributorIndex()
			contrib_index.name = name
			name_df.fillna({'year' : 0}, inplace=True)

			contrib_index.years_active =  int(name_df.sort_values(by='year', ascending=False).iloc[0]['year'] - name_df.sort_values(by='year', ascending=False).iloc[-1]['year'] + 1)
			contrib_index.total_in_citations = name_df['inCitations'].sum()
			contrib_index.number_of_papers = len(name_df.index)

			contrib_list.append(contrib_index)
			authors_looked_at.append(name)

# contrib_list = contrib_list.sort(key=lambda x: x.index)
for ci in contrib_list[:10]:
	#print(ci.name + str(round(ci.index, 2)))
	print(ci)