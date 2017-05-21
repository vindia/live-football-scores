var LiveScore = React.createClass({
  getInitialState: function() {
    return {
      homeTeamName: 'Home Team',
      awayTeamName: 'Away',
      goalsHomeTeam: 0,
      goalsAwayTeam: 0,
      date: null,
      status: null
    };
  },
  loadLatestScores: function() {
    $.ajax({
      headers: { 'X-Auth-Token': 'YOUR_API_KEY' },
      url: 'http://api.football-data.org/v1/teams/' + this.props.team + '/fixtures',
      dataType: 'json',
      cache: false,
      success: function(response) {
        var matches = response.fixtures.filter(function(f) { return f.status != "FINISHED"; });
        var match = matches.length > 0 ? matches[0] : null;

        if (match) {
          document.title = (match.result.goalsHomeTeam || 0) + '-' + (match.result.goalsAwayTeam || 0)
          this.setState({
            homeTeamName: match.homeTeamName,
            awayTeamName: match.awayTeamName,
            goalsHomeTeam: match.result.goalsHomeTeam || 0,
            goalsAwayTeam: match.result.goalsAwayTeam || 0,
            date: match.date,
            status: match.status
          });
        }
        else {
          // do something when there are no unfinished matches, e.g. show a message        
        }
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
    this.loadLatestScores();
    setInterval(this.loadLatestScores, this.props.pollInterval);
  },
  render: function() {
    return(
      <div className="container">
        <h1 className="main-title">AFC Ajax Live</h1>
        <div className="live-score">
          <div className="row">
            <TeamBox team_name={this.state.homeTeamName} goals={this.state.goalsHomeTeam} />
            <TeamBox team_name={this.state.awayTeamName} goals={this.state.goalsAwayTeam} />
          </div>
          <div className="row">
            <TimeBox start_time={this.state.date} status={this.state.status} />
          </div>
        </div>
      </div>
    );
  }
});

var TeamBox = React.createClass({
  render: function() {
    return(
      <div className="team-box six columns">
        <h1 className="team-name">{this.props.team_name}</h1>
        <p className="team-goals">{this.props.goals}</p>
      </div>
    );
  }
});

var TimeBox = React.createClass({
  render: function() {
    var start_time = new Date(this.props.start_time);
    var current_time = new Date();
    var minutes_playing = Math.round(Math.abs(current_time.getTime() - start_time.getTime()) / 1000 / 60);
    if (minutes_playing > 60) {
      minutes_playing = minutes_playing - 15
    }
    
    document.title = document.title + " (" + minutes_playing + "')"
    
    return(
      <div className="time-box twelve columns">
        <p>Start Time: {start_time.toLocaleDateString()} {start_time.toLocaleTimeString()}</p>
        <p>{minutes_playing} minutes playing</p>
        <p>{this.props.status}</p>
      </div>
    );
  }
})

ReactDOM.render(
  <LiveScore team="678" pollInterval="30000" />,
  document.getElementById('liveScore')
);
