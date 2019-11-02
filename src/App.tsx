import React, { Component } from 'react';
import './App.css';

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
        <PatternPage pattern={this.props.patterns[this.state.patternIndex].toUpperCase()} />
        <InputPage pattern={this.props.patterns[this.state.patternIndex].toUpperCase()} value={this.state.value} />
      </div>
  }
  handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.keyCode === 8) {
      this.setState({value: this.state.value.slice(0, -1)});
    }
  }
  handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    this.setState({value: this.state.value + String.fromCharCode(e.charCode).toUpperCase()});
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
    <Game patterns={["dog", "cat"]} />
  );
}

export default App;
