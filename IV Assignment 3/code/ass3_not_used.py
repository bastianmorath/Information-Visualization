import json
import pandas as pd
from pandas.io.json import json_normalize

filename = '../data/s2-corpus-00.json'
# filename = '../data/s2-corpus-00_full.json'
# filename = '../data/s2-corpus-00_quarter.json'

data = []
content = open(filename, "r").read() 
f = json.loads("[" + content.replace("}\n{", "},\n{") + "]")

df_original = json_normalize(f)[['inCitations',  'year', 'venue', 'title', 'authors' ]]

column_names = list(df_original) + ['author']
del column_names[0]
df = pd.DataFrame(columns=column_names)
for row in df_original.itertuples():
	authors = row.authors
	for dict in authors:
		print(list(row) +  [dict['name']])

		df = df.append(pd.DataFrame(list(row) +  [dict['name']], columns=column_names))
		
df.reset_index(inplace=True)
df['inCitations'] = df['inCitations'].apply(lambda x: len(x))
df.drop(['authors', 'index'], axis=1, inplace=True)
df.sort_values(by=['author'], inplace=True)

print(df)


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

df['flag'] = 0

for index, _ in df.iterrows():
	row = df.loc[index, :]
	if row['flag'] != 1:
		name = row['author']
		name_df = df[df['author'] == name]
		df.loc[df['author'] == name, 'flag'] = 1
		contrib_index = ContributorIndex()
		contrib_index.name = name
		# name_df.fillna({'year' : 0}, inplace=True)

		contrib_index.years_active =  int(name_df.sort_values(by='year', ascending=False).iloc[0]['year'] - name_df.sort_values(by='year', ascending=False).iloc[-1]['year'] + 1)
		contrib_index.total_in_citations = name_df['inCitations'].sum()
		contrib_index.number_of_papers = len(name_df.index)

		contrib_list.append(contrib_index)

# contrib_list = contrib_list.sort(key=lambda x: x.index)
for ci in contrib_list:
	#print(ci.name + str(round(ci.index, 2)))
	print(ci)