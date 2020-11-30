import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import tip from 'd3-tip';
import axios from 'axios';
import ReactDOM from 'react-dom';
import Teams from './Teams';
import React from 'react';
// import ReactTooltip from 'react-tooltip';
state = { teams: [] }
var width = 900;
var height = 700;

// const tipReact = (effect) => {
//     return (
//         <ReactTooltip />
//     );
// }

var tipShow = tip()
  .attr('class', 'd3-tip')
  .offset([-5, 0])
  .html(function(d) {
    console.log(d);
    var textToDisplay = '';
    const teams = d.srcElement.__data__.teams; 
    if (teams) {
        for (var i=0; i < teams.length; i++) {
            textToDisplay += teams[i].displayName + "\n";
        }
    }
    // console.log(textToDisplay);
    return textToDisplay;// var dataRow = d3.map.get(d.properties.name);
    //    if (dataRow) {
    //        console.log(dataRow);
    //        return dataRow.states + ": " + dataRow.mortality;
    //    } else {
    //        console.log("no dataRow", d);
    //        return d.properties.name + ": No data.";
    //    }
  })


var svg = d3.select('#vis').append('svg')
    .attr('width', width)
 	   .attr('height', height);

svg.call(tipShow);

var projection = d3.geoAlbersUsa()
    .scale(900) // mess with this if you want
    .translate([width / 2, height / 2]);

var path = d3.geoPath()
    .projection(projection);

var colorScale = d3.scaleLinear().range(["#D4EEFF", "#0099FF"]).interpolate(d3.interpolateLab);

// var countryById = d3.map();
var withStateTeam = [];

async function dataStates() {
  var teamsStates = ['Arizona', 'Arizona', 'Arkansas', 'Alabama', 'California', 'California', 'Colorado', 'California', 'California', 'California', 'Alabama', 'California', 'Alabama', 'California', 'California', 'California', 'California']  
  const response = await axios.get('http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/teams');
  const teams = response.data.sports[0].leagues[0].teams; 
  for (var i=0; i < teams.length; i++) {
    withStateTeam[i] = { ...teams[i], state : teamsStates[i]}
  }
  return withStateTeam;
} 
// Promise.all([
//     d3.json("USA.json"),
//     d3.csv("mortality.csv")
//     .then(typeAndSet)
//     .then(loaded)
// ])
// we use queue because we have 2 data files to load.

// d3.json("USA.json")
// d3.csv("mortality.csv")
// typeAndSet()

// d3.queue()
//     .defer(d3.json, "USA.json")
//     .defer(d3.csv, "mortality.csv", typeAndSet) // process
//     .await(loaded);
async function draw() {
    var usa = await d3.json("USA.json");
    var statesTeam = await dataStates();
    // var mortality = await d3.csv("mortality.csv");
    // var mord = typeAndSet(mortality);
    // console.log(statesTeam);
    loaded(usa, statesTeam);
}
// var mord = typeAndSet(mortality);
// loaded(usa, mortality);

function mapTeamState(states, statesTeam) {

    // for(var i = 0; i < statesTeam.length; i++) {
    //     if (statesTeam[i] === states.properties.name)
    // }
    for(var i=0; i < statesTeam.length; i++){
        for(var j=0; j <  states.length; j++) {
            if (!states[j].teams) {
                states[j].teams = [];
            }
            if (statesTeam[i].state === states[j].properties.name) {
                states[j].teams.push(statesTeam[i].team)
            }
        }
    }
    return states;
}

// function typeAndSet(d) {
//     d.mortality = +d.mortality;
//     console.log(d);
//     d3.map.set(d.states, d);
//     return d;
// }

function getColor(d) {
    console.log(d);
    return colorScale(1);
    // var dataRow = d3.map.get(d.properties.name);
    // if (dataRow) {
    //     console.log(dataRow);
    //     return colorScale(dataRow.mortality);
    // } else {
    //     console.log("no dataRow", d);
    //     return "#ccc";
    // }
}

function clickedState(teams) {
    console.log('clicky');
    this.setState( { teams: teams } )
    // const renderTeams = teams => {
    //     teams.map(async team => {
    //         const teamData = await axios.get(`http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/teams/${team.id}`)
    //         console.log(teamData)
    //         return (
    //             <div>{teamData.rank}</div>
    //         )
    //     })
    // }
    // const NewTeams = <Teams teams={teams}/>
    // const Teams = () => {
    //     return (
    //         <div>{renderTeams}</div>
    //     )
    // }
    // const teamsIds = []
    // for(var i=0; i <  teams.length; i++){
    //     teamsIds.push({ id: teams[i].id })
    // }
    // console.log(teamsIds);
    ReactDOM.render(<Teams teams={this.state.teams} />, document.querySelector('#root'));
}


function loaded(usa, statesTeam) {

    // console.log(usa);
    // console.log(statesTeam);

    // var extent = d3.extent(mortality, function(d) {return d.mortality;});

    // var extent = d3.extent(mortality, function(d) {return d.mortality;});
    // colorScale.domain(d3.extent(mortality, function(d) {return d.mortality}));

    var states = topojson.feature(usa, usa.objects.units).features;

    states = mapTeamState(states, statesTeam);

    svg.selectAll('path.states')
        .data(states)
        .enter()
        .append('path')
        .attr('class', 'states')
        .attr('d', path)
        .on('mouseover', tipShow.show)
        .on('mouseout', tipShow.hide)
        .attr('fill', function(d,i) {
            // console.log(d.properties.name);
            return getColor(d);
        })
        .on('click', function(d) {
            console.log('clicked')
            clickedState(d.srcElement.__data__.teams);
            
        })
        .append("title");
}

draw();
