// new Date(timer * 1000).toISOString().substr(14, 5)
class CountDown {
    constructor(timer, callback) {
        this.timer = timer;
        this.state = 1; // 1 = running, 2 = pause, 3 = resume 
        this.cb = callback
        this.timerId = window.setInterval(() => {
            this.timer--;
            this.cb();
        }, 1000)
    }
    resume() {
        if(this.state != 2) return;
        this.state = 1;
        this.timerId = window.setInterval(() => {
            this.timer--;
            this.cb();
        }, 1000)
    }
    pause() {
        if(this.state != 1) return;
        this.state = 2;
        window.clearInterval(this.timerId)
    }
}

let timeCounter;

class App extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            breakLength: 5,
            sessionLength: 25,
            toggleCheck: true, 
            timeLeft: 1500, 
            timeRunningLabel: 'Session'
        }
        this.handleIncreateBreak = this.handleIncreateBreak.bind(this)
        this.handleIncreateSession = this.handleIncreateSession.bind(this)
        this.handleDecreateBreak = this.handleDecreateBreak.bind(this)
        this.handleDecreateSession = this.handleDecreateSession.bind(this)
        this.handleToggle = this.handleToggle.bind(this)
        this.setSessionTimer = this.setSessionTimer.bind(this)
        this.setBreakTimer = this.setBreakTimer.bind(this)
        this.handleReset = this.handleReset.bind(this)
    }

    handleIncreateSession() {    
        if(timeCounter) {
            // can not increate when timer is running
            if(timeCounter.state == 1) return;
        }
        const currentSess = this.state.sessionLength;
        if(currentSess <= 59) {
            this.setState(prevState => {
                if(this.state.timeRunningLabel == 'Session') {
                    if(timeCounter) {
                        timeCounter.timer = (prevState.sessionLength + 1) * 60;
                    }
                    return {
                        sessionLength: prevState.sessionLength + 1, 
                        timeLeft: (prevState.sessionLength + 1) * 60
                    }
                } else {
                    return {
                        sessionLength: prevState.sessionLength + 1
                    }
                }
            })
        }
        console.log(currentSess);
    }
    
    handleDecreateSession() {
        if(timeCounter) {
            // can not decreate when timer is running
            if(timeCounter.state == 1) return;
        }
        const currentSess = this.state.sessionLength;
        if(currentSess > 1) {
            this.setState(prevState => {
                if(this.state.timeRunningLabel == 'Session') {
                    if(timeCounter) {
                        timeCounter.timer = (prevState.sessionLength - 1) * 60;
                    }
                    return {
                        sessionLength: prevState.sessionLength - 1, 
                        timeLeft: (prevState.sessionLength - 1) * 60
                    }
                } else {
                    return {
                        sessionLength: prevState.sessionLength - 1
                    }
                }
            })
            
        }
    }
    
    handleIncreateBreak() {
        if(timeCounter) {
            if(timeCounter.state == 1) return;
        }
        const currentBreak = this.state.breakLength;
        if(currentBreak <= 59) {
            this.setState(prevState => {
                if(this.state.timeRunningLabel == 'Break') {
                    if(timeCounter) {
                        timeCounter.timer = (prevState.breakLength + 1) * 60;
                    }
                    return {
                        breakLength: prevState.breakLength + 1, 
                        timeLeft: (prevState.breakLength + 1) * 60
                    }
                } else {
                    return  {
                        breakLength: prevState.breakLength + 1
                    }
                }
            })
        }
    }
    
    handleDecreateBreak(sec) {
        if(timeCounter) {
            if(timeCounter.state == 1) return;
        }
        const currentBreak = this.state.breakLength;
        if(currentBreak > 1) {
            this.setState(prevState => {
                if(this.state.timeRunningLabel == 'Break') {
                    if(timeCounter) {
                        timeCounter.timer = (prevState.breakLength - 1) * 60;
                    }
                    return {
                        breakLength: prevState.breakLength - 1, 
                        timeLeft: (prevState.breakLength - 1) * 60
                    }
                } else {
                    return  {
                        breakLength: prevState.breakLength - 1
                    }
                }
            })
        }
    }
    
    setSessionTimer() {
        if(timeCounter) {
            if(timeCounter.timer >= 0) {
                this.setState({
                    timeLeft: timeCounter.timer
                })
            } else {
                // Session timeout
                timeCounter = undefined
                document.getElementById('beep').play()
                timeCounter = new CountDown(this.state.breakLength * 60,
                    this.setBreakTimer)
                this.setState({
                    timeRunningLabel: 'Break'
                })
            }
        }

    }
    
    setBreakTimer() {
        if(timeCounter) {
            if(timeCounter.timer >= 0) {
                this.setState({
                    timeLeft: timeCounter.timer
                })
            } else {
                // Break timeout
                timeCounter = undefined
                document.getElementById('beep').play()
                timeCounter = new CountDown(this.state.sessionLength * 60, this.setSessionTimer)
                this.setState({
                    timeRunningLabel: 'Session'
                })
            }
        }
    }
    
    handleToggle() {
        if(!timeCounter) {
            timeCounter = new CountDown(this.state.sessionLength * 60,this.setSessionTimer)
        }
        this.setState(prevState => ({
            toggleCheck: !prevState.toggleCheck
        }))
        if(this.state.toggleCheck) {
            timeCounter.resume();
            document.getElementById('toggle-btn').classList.remove('fa-play');
            document.getElementById('toggle-btn').classList.add('fa-pause');
        } else {
            timeCounter.pause();
            document.getElementById('toggle-btn').classList.remove('fa-pause');
            document.getElementById('toggle-btn').classList.add('fa-play');
        }
       
    }
    
    handleReset() {
        this.setState({
            breakLength: 5,
            sessionLength: 25,
            toggleCheck: true, 
            timeLeft: 1500, 
            timeRunningLabel: 'Session'
        })
        timeCounter = undefined;
    }
    
    componentDidUpdate() {
        if(this.state.timeLeft < 60) {
            document.querySelector('p.time-running').style.color = 'red'
            document.getElementsByClassName('label')[2].style.color = 'red'
        } else {
            document.querySelector('p.time-running').style.color = 'white'
            document.getElementsByClassName('label')[2].style.color = 'white'
        }
    }
    
    render() {
        return(
            <div className="app">
                <h1 className="main-title">Pomodoro Clock</h1>
                <LengthControl 
                label = "Break Length"
                handleIncreate = {this.handleIncreateBreak}
                handleDecreate = {this.handleDecreateBreak}
                timeSetting = {this.state.breakLength}
                id="break-label"
                increment="break-increment"
                decrement="break-decrement"
                lengthId="break-length"
                />

                <LengthControl 
                label = "Session Length"
                handleIncreate = {this.handleIncreateSession}
                handleDecreate = {this.handleDecreateSession}
                timeSetting = {this.state.sessionLength}
                id="session-label"
                increment="session-increment"
                decrement="session-decrement"
                lengthId="session-length"
                />

                <div className="timer">
                    <p 
                    className="label"
                    id="timer-label">{this.state.timeRunningLabel}</p>
                    <p 
                    className="time-running"
                    id="time-left">{this.state.timeLeft != 3600 ?
                        new Date(this.state.timeLeft * 1000).toISOString().substr(14, 5) : '60:00'}</p>
                </div>
                {/* error */}
                <div className="time-ctrl">
                    <button 
                    onClick = {this.handleToggle}
                        id="start_stop">
                        <i 
                        className="fas fa-play"
                        id="toggle-btn"></i>
                    </button>

                    <button 
                    onClick={this.handleReset}
                    id="reset">
                        <i 
                        className="fas fa-undo"></i>
                    </button>
                </div>

                <div className="footer">Made with ❤️ by 
                    <a 
                    href="https://github.com/tranthaituananh" className="contact-link"
                    target="_blank"> Tran Thai Tuan Anh</a>
                </div>
                <audio id="beep" reload ="auto" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" />
            </div>
        )
    }
}

class LengthControl extends React.Component{
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <div className="length-control">
                    <div className="label" id={this.props.id}>{this.props.label}</div>
                    <div className="length-control-box">
                        <button 
                          id={this.props.increment}
                          onClick = {this.props.handleIncreate}>
                            <i 
                            className="fa fa-arrow-up" 
                            aria-hidden ="true"></i>
                        </button>
                            <div 
                            className="time-setting"
                            id={this.props.lengthId}>{this.props.timeSetting}
                            </div>

                        <button 
                          id={this.props.decrement}
                          onClick = {this.props.handleDecreate}>
                            <i className="fa fa-arrow-down" aria-hidden="true"></i>
                        </button>
                    </div>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'))