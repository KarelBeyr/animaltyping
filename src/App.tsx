import React, { Component } from 'react';
import './App.css';
import UIfx from 'uifx'
import { S_IFBLK } from 'constants';

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

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keypress', this.handleKeyPress);
  }
  componentWillUnmount()
  {
    document.removeEventListener('keydown', this.handleKeyDown)
    document.removeEventListener('keypress', this.handleKeyPress)
  }
  render() {
    const pattern = this.props.patterns[this.state.patternIndex]
    return <div className="App" tabIndex={0}>
        <div id="imageDiv" >
          <img src={require(`./res/${pattern.toLowerCase()}.jpg`)} alt={pattern} />
        </div>
        <div id="patternAndInput">
          {pattern}
          <br />  
          <InputPage pattern={pattern} value={this.state.value} />
        </div>
      </div>
  }

  handleKeyDown = (e: KeyboardEvent) => {
      if (e.keyCode === 8) {  //backspace
      this.setState({value: this.state.value.slice(0, -1)});
    }
    bell.play()
  }

  isAlphanum(code: number): boolean {
    return ((code > 47) && (code < 58)) ||
      code == 32 ||
      ((code > 64) && (code < 91)) ||
      ((code > 95) && (code < 112))
  }

  handleKeyPress = (e: KeyboardEvent) => {
    if (!this.isAlphanum(e.charCode)) return;

    const newValue = this.state.value + String.fromCharCode(e.charCode).toUpperCase()
    this.setState({value: newValue});
    if (newValue === this.props.patterns[this.state.patternIndex])
    {
      applause.play()
      this.setState({patternIndex: this.state.patternIndex + 1, value: ""});
    }
  }
}

interface InputPageProps {
  pattern: string
  value: string
}

export class InputPage extends Component<InputPageProps> {
  render() {
    return <span id="input">
      {this.props.value.split("").map((char, idx) => {
        return <span key={idx} className={this.props.value[idx] === this.props.pattern[idx] ? "ok" : "wrong"}>{char}</span>
      })}
    </span>
  }
}

const App: React.FC = () => {
  return (
    <Game patterns={["a dog", "a cat", "a bird", "a horse", "a snake",
      "a cow", "an elephant", "a fish", "an octopus", "a butterfly", "a lion", "a rabbit",
      "a pig", "a slug", "a snail"].map(_ => _.toUpperCase())} 
    />
  );
}

export default App;
