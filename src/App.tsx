import React, { Component } from 'react';
import './App.css';
import UIfx from 'uifx'

const bell = new UIfx(require("./res/bump.mp3"))
const applause = new UIfx(require("./res/applause.mp3"))

interface GameState {
  patternIndex: number
  value: string
}

interface GameProps {
  patterns: string[]
}

class Game extends Component<GameProps, GameState> {
  constructor(props: GameProps) {
    super(props);
    this.state = { patternIndex: 0, value: "" };
  }

  render() {
    return <div className="App" onKeyDown={this.handleKeyDown} onKeyPress={this.handleKeyPress} tabIndex={0}>
        <div id="imageDiv" />
        <PatternPage pattern={this.props.patterns[this.state.patternIndex]} />
        <InputPage pattern={this.props.patterns[this.state.patternIndex]} value={this.state.value} />
      </div>
  }
  handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.keyCode === 8) {  //backspace
      this.setState({value: this.state.value.slice(0, -1)});
    }
    bell.play()
  }
  handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const newValue = this.state.value + String.fromCharCode(e.charCode).toUpperCase()
    this.setState({value: newValue});
    if (newValue === this.props.patterns[this.state.patternIndex])
    {
      applause.play()
    }
    console.log(`${newValue} ?= ${this.props.patterns[this.state.patternIndex]}`)
  }
}

interface InputPageProps {
  pattern: string
  value: string
}

export class InputPage extends Component<InputPageProps> {
  render() {
    return <div  >
      {this.props.value.split("").map((char, idx) => {
        return <span key={idx} className={this.props.value[idx] === this.props.pattern[idx] ? "ok" : "wrong"}>{char}</span>
      })}
    </div>
  }

}

interface PatternPageProps {
  pattern: string
}

export class PatternPage extends Component<PatternPageProps> {
  render() {
    return <div id="templateDiv" >
      {this.props.pattern}
    </div>
  }
}

const App: React.FC = () => {
  return (
    <Game patterns={["dog", "cat"].map(_ => _.toUpperCase())} />
  );
}

export default App;
