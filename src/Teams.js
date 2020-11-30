import React from 'react';
import axios from 'axios';

class Teams extends React.Component {

    // state = { teams: this.props.teamsArray };
    // const getTeams = async () => {
    //     var teamsFound = this.props.teams;
    //     var teamsArray = []
    //     for(var key in teamsFound) {
    //         var teamData = await axios.get(`http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/teams/${teamsFound[key].id}`)
    //         teamsArray.push(teamData)
    //     }
    //     console.log(teamsArray)
    //     return teamsArray;
    // }



    // componentDidMount() {
    //     this.onTeamsList();
    //     console.log('mount')
    // }

    // onTeamsList = async () => {
    //     const teamDataArray = [];
    //     const teamsFound = this.state.teams;
    //     for(var key in teamsFound) {
    //         const response = await axios.get(`http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/teams/${teamsFound[key].id}`)
    //         teamDataArray.push(response)
    //     }

    //     this.setState({ teams: teamDataArray })
    //     console.log(this.state.teams)
        
    // }


    renderTeams() {
        console.log('teams data in Teams.js',this.props.teams);
        if (this.props.teams) {
            return this.props.teams.map(team => {
                return (
                        <div key={team.data.team.id}>
                            <div>
                                <h3>{team.data.team.displayName}</h3>
                                <p>{team.data.team.standingSummary}</p>
                            </div>
                        </div>
                    )
            });
        }
       
        
        
        // async () => {
        //     for(var key in teamsFound) {
        //         var teamData = await axios.get(`http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/teams/${teamsFound[key].id}`)
        //         console.log(teamData)
        //     }

        //     return teamData;
        //     // async function teamsData() {
        //     //     var dataTeam = await axios.get(`http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/teams/${teamsFound[key].id}`)
        //     //     console.log(dataTeam)
        //     // }
        //     // console.log(teamsData())         
        // }
        // return this.props.teams.map(async team => {
        //     console.log(team)
            // const teamData = await axios.get(`http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/teams/${team.id}`)
            // console.log(teamData);
            // return (
            //     <div>
            //         <div>
            //             <h3>{teamData.data.team.displayName}</h3>
            //             {teamData.data.team.standingSummary}
            //         </div>
            //     </div>
            // )
        // });
    }

    render() {
        // this.onTeamsList();
        return (
            <div>{this.renderTeams()}</div>
        )
    }
}

export default Teams;