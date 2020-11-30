import React from 'react';
import Teams from './Teams';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import tip from 'd3-tip';
import axios from 'axios';

class App extends React.Component {


    state = { teamsArray: [] };

    componentDidMount() {
        this.drawMap()
    }

    render() {
        console.log(this.state.teamsArray)
        return (
            <div>
                <Teams teams={this.state.teamsArray} />
            </div>
        )
    }

    drawMap = () => {
        const width = 900;
        var height = 700;

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
            return textToDisplay;
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
        
        async function draw() {
            var usa = await d3.json("USA.json");
            var statesTeam = await dataStates();
            loaded(usa, statesTeam);
        }

        function mapTeamState(states, statesTeam) {
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

        function getColor(d) {
            console.log(d);
            return colorScale(1);
        }

        const onTeamsList= async (team) => {
            // const teamDataArray = [];
            // // const teamsFound = this.state.teams;
            // for ( var team of teams) {
            const response = await axios.get(`http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/teams/${team.id}`)
                // const data = await response.data;
            //     console.log(response);
            //     teamDataArray.push(response)
            // }
            // console.log('teamDataArray: ', teamDataArray);
            // return teamDataArray;
            return response;
        }

        const clickedState = async (teams) => {
            const teamDataArray = []
            for (var team of teams) {
                const teamsWithData = await onTeamsList(team);
                teamDataArray.push(teamsWithData);
                this.setState({ teamsArray: teamDataArray })
            }
            
            // console.log(this.state.teamsArray);
            // console.log(this);
            // this.setState({ teamsArray: teamsWithData });
            // // console.log(this.state.teamsArray);
            // ReactDOM.render(<Teams teams={this.state.teams} />, document.querySelector('#root'));
        }


        function loaded(usa, statesTeam) {

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
                    return getColor(d);
                })
                .on('click', function(d) {
                    console.log('clicked')
                    clickedState(d.srcElement.__data__.teams);
                    // this.setState({ teamsArray: d.srcElement.__data__.teams })
                    
                })
                // .on('click', (d) => this.setState({ eamsArray: d.srcElement.__data__.teams }))
                .append("title");
        }
        draw();
    }
}

export default App;