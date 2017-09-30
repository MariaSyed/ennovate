import React, {Component} from 'react'
import * as firebase from 'firebase'
import NavBar from '../components/NavBar'
import styles from '../styles/ChallengesContainerStyles'
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Redirect } from 'react-router-dom'

class About extends Component {
  state = {
    challenges: {},
    redirectTo: null
  }

  componentDidMount() {
    firebase.database().ref('/challenges').on('value', (snapshot) => {
      const challenges = snapshot.val()
      const orderedChallenges = {}
      if (challenges) {
        this.setState({ challenges: challenges })
      }
    })
  }

  handleOnVote = (pushKey, votes) => {
    firebase.database().ref('/challenges/' + pushKey + '/votes').set(votes + 1)
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo}  />
    }
    return (
      <div>
        <NavBar title='Challenges'/>
        <div style={{ width: '80%', marginLeft: 'auto', marginRight: 'auto' }}>
        <Grid fluid style={{ marginTop: 30 }}>
          <Row className="show-grid">
            {
              Object.keys(this.state.challenges).map((key) => {
                const challenge = this.state.challenges[key]
                return (
                  <Col xs={6} style={{ marginTop: 20 }} key={key}>
                    <div style={{ margin: 5 }}>
                      <div onClick={() => this.setState({ redirectTo: '/challenge/' + key })}>
                        <p style={styles.challengeTitle}>{challenge.title}</p>
                      </div>
                      <p style={styles.description}>{challenge.description}</p>
                      <div style={{ textAlign: 'center', marginTop: 40, marginLeft: 'auto', marginRight: 'auto'}}>
                        <button style={styles.button}>Organise</button>
                        <button style={styles.button} onClick={() => this.handleOnVote(key, challenge.votes)}>Votes {challenge.votes}</button>
                        <button style={styles.button}>Participate</button>
                        <button style={styles.button}>Mentor</button>
                      </div>
                    </div>
                  </Col>
                )
              })
            }

          </Row>
        </Grid>
        </div>
      </div>
    )
  }
}

export default About
