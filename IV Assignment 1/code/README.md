# CS5346_Assignment_1

## How to run this code


```
python -m SimpleHTTPServer 8000
Browser: http://localhost:8000/
```

## Graph 1 - Average number of changes in quality + average quality per method for each buffer configuration

#### What type of chart did I use?

I chose a two-axis scatter plot, where the x-axis depicts the average 
quality and the y-axis depicts the average 
number of changes in quality during the playback, for this particular buffer configuration. For each of the buffer configuration I thus plotted one dot (one for each method).
Note that the three plots have different scaling. If we want to compare the three buffer configurations, we could further normalize the axis then. I did not do this because I wanted this graph to focus on one buffer configuration at a time. 

#### Why did I chose this type of chart?

I found this to be a good representation because you can see the trade-off between the two metrics. An optimal solution would thus be a point in the bottom right corner (a low average number of quality changes and a high average quality), a bad solution would be in the top-left corner (a high average of number of buffer changes and a low average quality performance). 

#### Analysis

When analyzing the plot one could see the following (NOTE: During the following discussions, I always assume that a high number of quality changes is a bad thing, as for myself, I consider a lot of changes in quality very interruptive in my viewing experience)

For Buffer-Size 240: 
- Method 3 has the best trade-off between the average streaming quality and the average number of quality changes, as it is very far in the bottom-right position. Method 5,6 and 10 have a small advantage in average quality, but also a higher average number of changes in quality.  
On the opposite, Method 4, 8 and 9 sit in the top-left corner, meaning they have a bad trade-off between the two metrics. 

For Buffer-Size 120: 
- Method 3 and 6 have the best trade-off between the average streaming quality and the average number of quality changes, as it is in the bottom-right most position. Method 1 is an outlier and has both the worst average streaming quality and also the highest average number of quality changes.

For Buffer-Size 30/60: 
- Method 3, 5 and 6 have the best trade-off between the average streaming quality and the average number of quality changes, as it is in the bottom-right most position. Method 1 is again an outlier and has a mediocre average streaming quality and the highest average number of changes. 

## Graph 2 - Average QoE per Method and buffer configuration

#### What type of chart did I use?

I chose a heatmap to visualize the data. Each tile shows the Quality of Experience (QoE) for a specific buffer and method combination. The greener the color, the higher the QoE, and the more red the color, the lower the QoE.

#### Why did I chose this type of chart?

I chose a heatmap to visualize the data, as it neatly shows for each combination of buffer configuration and method the average quality of experience (QoE) as a color. Colors help to quickly get an idea of how big the QoE is and to spot patterns. 

#### Analysis
We can see that Methods 5, 6 and 10 have the highest QoE, independent of which buffer size is chosen. On the other hand, Method 1 shows a bad QoE, in particular with higher buffer sizes. 

## Graph 3 - Correlation between inefficiency and quality for each method per buffer configuration

#### What type of chart did I use?

I chose a two-axis scatter plot, where the x-axis depicts the average 
quality of streaming and the y-axis depicts the average inefficiency of all test-runs for this particular method/buffer-size configuration.

For each of the buffer configuration I thus plotted one dot (one for each method).

#### Why did I chose this type of chart?

I found this to be a good representation because you can see the trade-off between the two metrics. An optimal solution would thus be a point in the bottom right corner (only a low average inefficiency and a high average quality), a bad solution would be in the top-left corner (a high average inefficiency and a low average quality performance). 
Note that the three plots have different scaling. If we want to compare the three buffer configurations, we could further normalize the axis then. I did not do this because I wanted this graph to focus on one buffer configuration at a time. 

#### Analysis

After analyzing the plot one could say the following:

For Buffer-Size 240: 
 - Method 3, 4, 5, 6 and 10 have the best trade-off between the average streaming quality and the average inefficiency, as it is in the bottom-right most position.
 
For Buffer-Size 120: 
 - Method 4, 5, 6 and 10 have the best trade-off between the average streaming quality and the average inefficiency, as it is in the bottom-right most position.
 
For Buffer-Size 30/60: 
 - Method 4, 5 and 6 have the best trade-off between the average streaming quality and the average inefficiency, as it is in the bottom-right most position.
 
Overall, methods 7 and 8 seem to perform the worst, while 4, 5 and 6 seem to perform the best.

Regarding the correlation, we can see that there is a correlation between the average inefficiency and the average quality, as most of the points in the graph are distributed around the 45-Degree-Line going from the bottom left to the top right. 
 
 
## Graph 4 - Average number of stalls for V7 for different methods and profiles

#### What type of chart did I use?

I chose a grouped bar-chart, where the y-axis depicts the average number of stalls for V7, and x-axis the different methods  and the four profiles, respectively. 

#### Why did I chose this type of chart?

I find it a good representation because you can easily compare the average number of stalls for each method for each profile, and by looking and the height of the bar we can also easily find the methods which have the lowest average number of stalls for V7. 

#### Analysis

After analyzing the plot one could say the following:

For Profile 1:
- Most methods do not have any stalls expect Method 1 and Method 4. 

For Profile 2:
- Most methods have a relatively small average number of stalls, with Method 2, 5 and 10 being the lowest.

For Profile 3:
- Method 10 has the lowest average number of stalls for V7.

For Profile 4:
- All methods have a relatively high average number of stalls, but Method 3 has the smallest. 
