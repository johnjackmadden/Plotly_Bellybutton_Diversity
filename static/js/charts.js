function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("static/js/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("static/js/samples.json").then((data) => {
    var metadata = data.metadata;
    

    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample,buildMetadata) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("static/js/samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleData = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = sampleData.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    // console.log(result)

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var ids = result.otu_ids.slice(0,10).reverse();
    var labels = result.otu_labels.slice(0,10).reverse();
    var values = result.sample_values.slice(0,10).reverse();

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = labels;

    // 8. Create the trace for the bar chart. 
    var barData = [{
			x: values,
			y: ids.map(outId => `OTU ${outId}`),
			text: yticks,
			type: "bar",
			orientation: "h",
      marker: {
        color: 'indianred'
      }
      // marker{color:"lightcoral"}
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: '<b>Top 10 Bacteria Cultures Found</b>',
      font: { family: 'Courier New, monospace' },
      xaxis: { title: "<b>Sample Value</b>", font: { family: 'Courier New, monospace' },},
      yaxis: { title: "<b>OTU ID</b>", font: { family: 'Courier New, monospace' },},
      autosize: false,
      width: 450,
      height: 600
  };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout);    

  // Bubble chart
    // 1. Create the trace for the bubble chart.
    var trace2 = {
			x: result.otu_ids,
			y: result.sample_values,
			text: result.otu_labels,
			mode: 'markers',
			marker: {
				color: result.otu_ids,
				size: result.sample_values
			}
		};
		
		var bubbleData = [trace2];
		
    // 2. Create the layout for the bubble chart.
		var bubbleLayout = {
      title: '<b>Bacteria Cultures per Sample</b>',
      font: { family: 'Courier New, monospace' },
			xaxis: { title: "OTU ID"},
			yaxis: { title: "Sample Value"}, 
      showlegend: false
		};
		
    // 3. Use Plotly to plot the data with the layout.
		Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // 3. Create a variable that holds the washing frequency.
    var metaData = data.metadata.filter(sampleObj => sampleObj.id == sample);
    var washFrequency = parseFloat(metaData[0].wfreq);
    // console.log(washFrequency);

    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washFrequency,
        title: { text: '<b>Belly Button Washing Frequency</b> <br> Scrubs per week',
            // font-family: "Lucida Console", "Courier New", monospace;
            font: {
              family: 'Courier New, monospace'
            }},
        type: "indicator",
        mode: "gauge+number",gauge: {
          axis: { range: [0, 10] },
          steps: [
            { range: [0, 2], color: "oldlace" },
            { range: [2, 4], color: "antiquewhite" },
            { range: [4, 6], color: "bisque" },
            { range: [6, 8], color: "peachpuff" },
            { range: [8, 10], color: "lightsalmon" }
          ],
          threshold: {
            line: { color: "indianred", width: 4 },
            thickness: 0.75,
            value: 9
          }
        }
      }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      margin: { t: 0, b: 0 }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}

// var layout = 
// Plotly.newPlot('myDiv', data, layout);